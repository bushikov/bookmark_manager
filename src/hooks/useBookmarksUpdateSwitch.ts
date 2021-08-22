import { useRecoilState } from "recoil";
import { bookmarksUpdateState } from "atoms";

export const useBookmarksUpdateSwitch = () => {
  const [updateState, setUpdateState] = useRecoilState(bookmarksUpdateState);

  const switchState = () => {
    setUpdateState(!updateState);
  };

  return { updateState, switchState };
};
