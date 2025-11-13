import { Href } from 'expo-router';
import { SpecificIconProps } from './global';

export interface ScreenNavigatorProps {
  title: string;
  icon: string;
  iconType: SpecificIconProps;
  link: Href;
  isLast: boolean;
}
