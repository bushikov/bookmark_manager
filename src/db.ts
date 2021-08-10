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

// type GroupTagRelationship = {
//   groupName: string;
//   tagNames: string[];
// };

export type BookmarkWithTags = Bookmark & { tags: string[] };

class MyDB extends Dexie {
  bookmarks: Dexie.Table<Bookmark, number>;
  bookmarkTagRelationship: Dexie.Table<BookmarkTagRelationship, number>;
  // groupTagRelationship: Dexie.Table<GroupTagRelationship, string>;

  constructor() {
    super("MYDB");
    this.version(1).stores({
      bookmarks: "++id,&url,title",
      bookmarkTagRelationship: "++id,tagName,bookmarkId,&[tagName+bookmarkId]",
      // groupTagRelationship: "groupName",
    });
  }

  async addTag(tag: string, bookmark: BookmarkWithTags): Promise<void> {
    return this.transaction(
      "rw",
      this.bookmarks,
      this.bookmarkTagRelationship,
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

  async getBookmarksWithTagsByTag(tag: string): Promise<BookmarkWithTags[]> {
    return this.transaction(
      "r",
      [this.bookmarks, this.bookmarkTagRelationship],
      async () => {
        const bookmarkIds = await this.bookmarkTagRelationship
          .where("tagName")
          .equals(tag)
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
}

export default new MyDB();
