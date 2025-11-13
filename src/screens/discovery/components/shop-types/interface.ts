import { IGlobalComponentProps } from '@/utils/interfaces';

export interface IShopType {
  _id: string;
  title?: string;
  image?: string;
}

export interface IVideoItemComponent extends IGlobalComponentProps {
  url: string;
}
