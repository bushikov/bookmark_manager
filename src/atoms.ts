import { atom } from "recoil";

export const bookmarksUpdateState = atom({
  key: "bookmarksState",
  default: true,
});

export const tagsUpdateState = atom({
  key: "tagsUpdateState",
  default: true,
});

export const tagAliasesUpdateState = atom({
  key: "tagAliasesUpdateState",
  default: true,
});
