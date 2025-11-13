import { IGlobalComponentProps, SpecificIconProps } from '@/utils/interfaces';
import { ImageStyle, TextStyle } from 'react-native';

export interface ICustomIconTextField extends IGlobalComponentProps {
  icon?: SpecificIconProps; // Optional icon prop
  label: string; // Required label prop
  onPress: () => void; // Required onPress function
  height?: number; // Optional size prop
  width?: number | string;
  borderColor?: string; // Optional border color
  backgroundColor?: string; // Optional background color
  textColor?: string; // Optional text color
  borderRadius?: number; // Optional border radius
  padding?: number; // Optional padding
  iconStyle?: ImageStyle; // Optional style for the icon
  textStyle?: TextStyle; // Optional style for the text
  disabled?: boolean; // optional style for showing the disable
}
