import Dexie from "dexie";

export type Bookmark = {
  id?: number;
  url: string;
  title: string;
  favIcon?: Object;
  favIconUrl: string;
  tags?: Set<string>;
};

export type Tag = {
  id?: number;
  name: string;
  bookmarkIds: Set<number>;
  tagAliasIds: Set<number>;
};

export type AliasType = "and" | "or";

export type TagAlias = {
  id?: number;
  name: string;
  type: AliasType;
  tags: Set<string>;
};

class MyDB extends Dexie {
  bookmarks: Dexie.Table<Bookmark, number>;
  tags: Dexie.Table<Tag, number>;
  tagAliases: Dexie.Table<TagAlias, number>;

  constructor() {
    super("MYDB");
    this.version(1).stores({
      bookmarks: "++id,&url,title",
      tags: "++id,&name",
      tagAliases: "++id,&name",
    });
  }

  getBookmarksByUrls(urls: string[]): Promise<Bookmark[]> {
    return this.bookmarks.where("url").anyOf(urls).toArray();
  }

  async getBookmarksByTags(tags: Set<string>): Promise<Bookmark[]> {
    const bookmarkIds = await this.tags
      .where("name")
      .anyOf([...tags])
      .toArray((records) =>
        records.reduce((acc, record) => {
          record.bookmarkIds.forEach((bookmarkId) => acc.add(bookmarkId));
          return acc;
        }, new Set() as Set<number>)
      );

    return this.bookmarks.bulkGet([...bookmarkIds]);
  }

  async getBookmarksByTagAlias(tagAlias: TagAlias): Promise<Bookmark[]> {
    const tagNames = await this.getTagNamesByTagAlias(tagAlias);

    switch (tagAlias.type) {
      case "and":
        return this.bookmarks.bulkGet([
          ...(await this.getBookmarkIdsHavingAllTags(tagNames)),
        ]);
      case "or":
        return this.getBookmarksByTags(tagNames);
    }
  }

  searchTags(texts: string[]): Promise<Tag[]> {
    return this.tags.where("name").startsWithAnyOfIgnoreCase(texts).toArray();
  }

  searchAliases(texts: string[]): Promise<TagAlias[]> {
    return this.tagAliases
      .where("name")
      .startsWithAnyOfIgnoreCase(texts)
      .toArray();
  }

  addTag(tagName: string, bookmark: Bookmark): Promise<void> {
    return this.transaction("rw", [this.bookmarks, this.tags], async () => {
      const tagsToPut = bookmark.tags
        ? bookmark.tags
        : (new Set() as Set<string>);
      const bookmarkToPut = {
        ...bookmark,
        tags: new Set([...tagsToPut, tagName]),
      };
      const bookmarkId = await this.bookmarks.put(bookmarkToPut);

      const tag = await this.tags.get({ name: tagName });
      const newBookmarkIds: Set<number> = tag
        ? new Set([...tag.bookmarkIds, bookmarkId])
        : new Set([bookmarkId]);
      const tagToPut = tag
        ? { ...tag, bookmarkIds: newBookmarkIds }
        : {
            name: tagName,
            bookmarkIds: newBookmarkIds,
            tagAliasIds: new Set([]),
          };
      await this.tags.put(tagToPut);
    });
  }

  renameTag(newTag: Tag): Promise<void> {
    return this.transaction(
      "rw",
      [this.bookmarks, this.tags, this.tagAliases],
      async () => {
        const storedTag = await this.tags.get(newTag.id);
        await this.tags.update(newTag.id, { name: newTag.name });

        storedTag.bookmarkIds.forEach(async (id) => {
          const bookmark = await this.bookmarks.get(id);
          bookmark.tags.delete(storedTag.name);
          bookmark.tags.add(newTag.name);
          await this.bookmarks.put(bookmark);
        });

        storedTag.tagAliasIds.forEach(async (id) => {
          const tagAlias = await this.tagAliases.get(id);
          tagAlias.tags.delete(storedTag.name);
          tagAlias.tags.add(newTag.name);
          await this.tagAliases.put(tagAlias);
        });
      }
    );
  }

  removeTag(tagName: string, bookmark: Bookmark): Promise<void> {
    return this.transaction("rw", [this.bookmarks, this.tags], async () => {
      const tag = await this.tags.get({ name: tagName });
      const newBookmarkIds = new Set([...tag.bookmarkIds]);
      newBookmarkIds.delete(bookmark.id);
      if (newBookmarkIds.size === 0) {
        await this.tags.delete(tag.id);
      } else {
        await this.tags.put({ ...tag, bookmarkIds: newBookmarkIds });
      }

      const storedBookmark = await this.bookmarks.get({ id: bookmark.id });
      const newTags = new Set([...storedBookmark.tags]);
      newTags.delete(tagName);
      if (newTags.size === 0) {
        await this.bookmarks.delete(bookmark.id);
      } else {
        await this.bookmarks.put({ ...storedBookmark, tags: newTags });
      }
    });
  }

  async putTagAlias(tagAlias: TagAlias): Promise<void> {
    return this.transaction("rw", [this.tags, this.tagAliases], async () => {
      const tagAliasId = await this.tagAliases.put(tagAlias);

      tagAlias.tags.forEach(async (tag) => {
        const storedTag = await this.tags.get({ name: tag });
        if (!storedTag) return;
        storedTag.tagAliasIds.add(tagAliasId);
        await this.tags.put(storedTag);
      });
    });
  }

  async removeTagAlias(tagAlias: TagAlias): Promise<void> {
    this.transaction("rw", [this.tags, this.tagAliases], async () => {
      await this.tagAliases.delete(tagAlias.id);

      tagAlias.tags.forEach(async (tag) => {
        const storedTag = await this.tags.get({ name: tag });
        if (!storedTag) return;
        storedTag.tagAliasIds.delete(tagAlias.id);
        await this.tags.put(storedTag);
      });
    });
  }

  private async getTagNamesByTagAlias(
    tagAlias: TagAlias
  ): Promise<Set<string>> {
    const storedTagAlias = await this.tagAliases.get(tagAlias.id);
    if (!storedTagAlias) return new Set([]);
    return storedTagAlias.tags;
  }

  private async getBookmarkIdsHavingAllTags(
    tagNames: Set<string>
  ): Promise<Set<number>> {
    if (tagNames.size === 0) return new Set() as Set<number>;

    const tags = await this.tags
      .where("name")
      .anyOf([...tagNames])
      .toArray();

    if (tags.length !== tagNames.size) return new Set([]);

    return tags
      .map((tag) => tag.bookmarkIds)
      .reduce((acc, ids) => {
        const intersection = new Set() as Set<number>;
        ids.forEach((id) => {
          if (acc.has(id)) intersection.add(id);
        });
        return intersection;
      });
  }
}

export default new MyDB();
