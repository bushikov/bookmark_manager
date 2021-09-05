import { useRecoilState } from "recoil";
import { tagAliasesUpdateState } from "atoms";

export const useTagAliasesUpdateSwitch = () => {
  const [updateState, setUpdateState] = useRecoilState(tagAliasesUpdateState);

  const switchState = () => {
    setUpdateState(!updateState);
  };

  return { updateState, switchState };
};
