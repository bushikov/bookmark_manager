import Dexie from "dexie";

export type Bookmark = {
  id?: number;
  url: string;
  title: string;
  favicon?: Object;
  favIconUrl: string;
};

type BookmarkTagRelationship = {
  id?: number;
  tagName: string;
  bookmarkId: number;
};

export type AliasType = "rename" | "and" | "or";

export type TagAlias = {
  aliasName: string;
  type: AliasType;
  tags: string[];
};

export type BookmarkWithTags = Bookmark & { tags: string[] };

class MyDB extends Dexie {
  bookmarks: Dexie.Table<Bookmark, number>;
  bookmarkTagRelationship: Dexie.Table<BookmarkTagRelationship, number>;
  tagAliases: Dexie.Table<TagAlias, string>;

  constructor() {
    super("MYDB");
    this.version(1).stores({
      bookmarks: "++id,&url,title",
      bookmarkTagRelationship: "++id,tagName,bookmarkId,&[tagName+bookmarkId]",
      tagAliases: "aliasName",
    });
  }

  async addTag(tag: string, bookmark: BookmarkWithTags): Promise<void> {
    return this.transaction(
      "rw",
      [this.bookmarks, this.bookmarkTagRelationship],
      async () => {
        const storedBookmark = await this.bookmarks.get({ url: bookmark.url });
        let bookmarkId: number;
        if (!storedBookmark) {
          bookmarkId = await this.bookmarks.add({
            url: bookmark.url,
            title: bookmark.title,
            favIconUrl: bookmark.favIconUrl,
          });
        } else {
          bookmarkId = storedBookmark.id;
        }

        await this.bookmarkTagRelationship
          .put({
            tagName: tag,
            bookmarkId,
          })
          .catch((e) => {
            // 重複したタグ登録のとき
            console.log(e);
          });
      }
    );
  }

  async getBookmarksWithTagsByTag(tags: string[]): Promise<BookmarkWithTags[]> {
    return this.transaction(
      "r",
      [this.bookmarks, this.bookmarkTagRelationship],
      async () => {
        const bookmarkIds = await this.bookmarkTagRelationship
          .where("tagName")
          // .equals(tag)
          .anyOfIgnoreCase(tags)
          .toArray((records) => records.map((record) => record.bookmarkId));

        const bookmarks = await this.bookmarks.bulkGet(bookmarkIds);
        const urls = bookmarks.map((bookmark) => bookmark.url);

        return await this.getBookmarksWithTagsByUrls(urls);
      }
    );
  }

  async getBookmarksWithTagsByUrls(
    urls: string[]
  ): Promise<BookmarkWithTags[]> {
    return this.transaction(
      "r",
      [this.bookmarks, this.bookmarkTagRelationship],
      async () => {
        const bookmarks = await this.bookmarks
          .where("url")
          .anyOf(urls)
          .toArray();

        const bookmarkIds = bookmarks.map((b) => b.id);
        const bookmarkTagRelationship = await this.bookmarkTagRelationship
          .where("bookmarkId")
          .anyOf(bookmarkIds)
          .toArray();

        return bookmarks.map((b) => {
          return {
            id: b.id,
            url: b.url,
            title: b.title,
            favIconUrl: b.favIconUrl,
            tags: bookmarkTagRelationship
              .filter((btr) => btr.bookmarkId === b.id)
              .map((btr) => btr.tagName),
          };
        });
      }
    );
  }

  async removeTag(tag: string, bookmark: BookmarkWithTags): Promise<void> {
    return this.transaction(
      "rw",
      [this.bookmarks, this.bookmarkTagRelationship],
      async () => {
        await this.bookmarkTagRelationship
          .where("bookmarkId")
          .equals(bookmark.id)
          .and((btr) => btr.tagName === tag)
          .delete();

        const relationship = await this.bookmarkTagRelationship
          .where("bookmarkId")
          .equals(bookmark.id)
          .toArray();

        if (relationship.length === 0) {
          await this.bookmarks.where("id").equals(bookmark.id).delete();
        }
      }
    );
  }

  async getTags(texts: string[]): Promise<string[]> {
    return this.transaction("r", this.bookmarkTagRelationship, async () => {
      return await this.bookmarkTagRelationship
        .where("tagName")
        .startsWithAnyOfIgnoreCase(texts)
        .toArray((records) =>
          Array.from(new Set(records.map((record) => record.tagName)))
        );
    });
  }

  async getAliases(texts: string[]): Promise<TagAlias[]> {
    return this.transaction("r", this.tagAliases, async () => {
      return await this.tagAliases
        .where("aliasName")
        .startsWithAnyOfIgnoreCase(texts)
        .toArray();
    });
  }

  async getBookamrksByTagAlias(alias: TagAlias | null): Promise<Bookmark[]> {
    return this.transaction(
      "r",
      [this.tagAliases, this.bookmarkTagRelationship, this.bookmarks],
      async () => {
        if (!alias) return Promise.resolve([]);
        const storedTagAlias = await this.tagAliases.get(alias.aliasName);
        if (!storedTagAlias) return Promise.resolve([]);

        let bookmarkIds;
        let urls;
        switch (storedTagAlias.type) {
          case "rename":
          case "or":
            bookmarkIds = await this.bookmarkTagRelationship
              .where("tagName")
              .anyOfIgnoreCase(storedTagAlias.tags)
              .toArray((records) => records.map((record) => record.bookmarkId));

            urls = await this.bookmarks
              .where("id")
              .anyOf(bookmarkIds)
              .toArray((records) => records.map((record) => record.url));

            return await this.getBookmarksWithTagsByUrls(urls);
          case "and":
            const bookmarkIdsOnTag = await this.bookmarkTagRelationship
              .where("tagName")
              .anyOfIgnoreCase(storedTagAlias.tags)
              .toArray((records) =>
                records.reduce((acc, record) => {
                  acc[record.tagName] ||= [];
                  acc[record.tagName].push(record.bookmarkId);
                  return acc;
                }, {})
              );

            // 積集合(intersection)を算出する
            bookmarkIds = Object.values(bookmarkIdsOnTag).reduce(
              (acc: number[], ids: number[]) => {
                return acc.filter((a) => ids.includes(a));
              }
            );

            urls = await this.bookmarks
              .where("id")
              .anyOf(bookmarkIds)
              .toArray((records) => records.map((record) => record.url));

            return await this.getBookmarksWithTagsByUrls(urls);
        }
      }
    );
  }

  async getTagsByAlias(alias: TagAlias | null): Promise<string[]> {
    return this.transaction("r", this.tagAliases, async () => {
      if (!alias) return Promise.resolve([]);

      const record = await this.tagAliases.get(alias);
      if (!record) return Promise.resolve([]);
      return Promise.resolve(record.tags);
    });
  }

  async putAlias(alias: TagAlias): Promise<void> {
    return this.transaction("rw", this.tagAliases, async () => {
      await this.tagAliases.put(alias);
    });
  }

  async removeAlias(aliasName: string): Promise<void> {
    return this.transaction("rw", this.tagAliases, async () => {
      await this.tagAliases.delete(aliasName);
    });
  }
}

export default new MyDB();
