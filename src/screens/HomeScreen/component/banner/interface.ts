import { IGlobalComponentProps } from '@/utils/interfaces';
import { ViewProps } from 'react-native';

export interface IBannner {
  _id: string;
  title?: string;
  description?: string;
  file?: string;
  action?: string;
  screen?: string;
  parameters?: string;
  slug?: string;
  shopType?: string;
}

export interface IVideoItemComponent extends IGlobalComponentProps, ViewProps {
  url: string;
  [key: string]: any;
}
