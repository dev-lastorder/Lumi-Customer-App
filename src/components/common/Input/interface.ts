import { IDropdownItem, IGlobalComponentProps, TIconType } from '@/utils/interfaces';
import { KeyboardTypeOptions } from 'react-native';

import { IDropdownItem, IGlobalComponentProps, TIconType } from '@/utils/interfaces';
import { KeyboardTypeOptions, TextStyle } from 'react-native';

export interface InputWithLabelProps extends IGlobalComponentProps {
  label: string;
  iconName?: any;
  type?: TIconType;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions | undefined;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  value: string;
  showErrorMessage?: boolean;
  errorMessage?: string;
  onChangeText?: (text: string) => void;
  validate?: (text: string) => string | null; // returns error message or null
  as?: 'textarea';
  style?: TextStyle;
}

export interface ICustomDropdownProps extends IGlobalComponentProps {
  label: string;
  value: string;
  showErrorMessage?: boolean;
  errorMessage?: string;
  items: IDropdownItem[];
  onChange: (value: string) => void;
  placeholder?: string;
}
