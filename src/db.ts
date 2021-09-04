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
};

export type AliasType = "and" | "or";

export type TagAlias = {
  name: string;
  type: AliasType;
  tags: Set<string>;
};

class MyDB extends Dexie {
  bookmarks: Dexie.Table<Bookmark, number>;
  tags: Dexie.Table<Tag, number>;
  tagAliases: Dexie.Table<TagAlias, string>;

  constructor() {
    super("MYDB");
    this.version(1).stores({
      bookmarks: "++id,&url,title",
      tags: "++id,&name",
      tagAliases: "++id,&name",
    });
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
        : { name: tagName, bookmarkIds: newBookmarkIds };
      await this.tags.put(tagToPut);
    });
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

  getBookmarksByUrls(urls: string[]): Promise<Bookmark[]> {
    return this.bookmarks.where("url").anyOf(urls).toArray();
  }

  async getBookmarksByTags(tags: Set<string>): Promise<Bookmark[]> {
    const bookmarkIds = await this.tags
      .where("name")
      .anyOfIgnoreCase([...tags])
      .toArray((records) =>
        records.reduce((acc, record) => {
          record.bookmarkIds.forEach((bookmarkId) => acc.add(bookmarkId));
          return acc;
        }, new Set() as Set<number>)
      );

    return this.bookmarks.bulkGet([...bookmarkIds]);
  }

  async getBookmarksByTagAlias(tagAlias: TagAlias): Promise<Bookmark[]> {
    const tagNames = await this.getTagNamesByTagAlias(tagAlias.name);

    switch (tagAlias.type) {
      case "and":
        return this.bookmarks.bulkGet([
          ...(await this.getBookmarkIdsHavingAllTags(tagNames)),
        ]);
      case "or":
        return this.getBookmarksByTags(tagNames);
    }
  }

  async putTagAlias(tagAlias: TagAlias): Promise<void> {
    this.tagAliases.put(tagAlias);
  }

  async removeTagAlias(aliasName: string): Promise<void> {
    this.tagAliases.delete(aliasName);
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

  private async getTagNamesByTagAlias(aliasName: string): Promise<Set<string>> {
    const tagAlias = await this.tagAliases.get(aliasName);
    if (!tagAlias) return new Set([]);
    return tagAlias.tags;
  }

  private async getBookmarkIdsHavingAllTags(
    tagNames: Set<string>
  ): Promise<Set<number>> {
    if (tagNames.size === 0) return new Set() as Set<number>;

    const tags = await this.tags
      .where("name")
      .anyOfIgnoreCase([...tagNames])
      .toArray();

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
