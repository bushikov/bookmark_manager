import { useRecoilState } from "recoil";
import { tagsUpdateState } from "atoms";

export const useTagsUpdateSwitch = () => {
  const [updateState, setUpdateState] = useRecoilState(tagsUpdateState);

  const switchState = () => {
    setUpdateState(!updateState);
  };

  return { updateState, switchState };
};
