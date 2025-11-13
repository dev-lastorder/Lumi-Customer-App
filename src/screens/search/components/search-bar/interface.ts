import { Dispatch, SetStateAction } from "react";
import { TextInput } from "react-native";

export interface Props {
  search: string;
  setSearch?: (text: string) => void;
  handleOnBlur: () => void;
  handleOnChange: (text: string) => void;
  handleClearField: () => void;
  inputRef: React.RefObject<TextInput | null>
  isFocus: boolean;
  setIsFocus: (value: boolean) => void;
  setSeeAllFoods: Dispatch<SetStateAction<boolean>>;
  seeAllFoods: boolean;
}
