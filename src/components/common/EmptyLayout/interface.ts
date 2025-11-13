import { ImageSourcePropType, ImageStyle } from 'react-native';

export interface NoDataProps {
  imageSource?: ImageSourcePropType;
  title: string;
  description: string;
  imageStyles?: ImageStyle
}
