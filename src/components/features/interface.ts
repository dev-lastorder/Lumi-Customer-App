import { IDiscoveryPreview, SpecificIconProps, TQueryArguments } from '@/utils/interfaces';

export interface IDiscoveryCarousel<T> {
  queryArguments: TQueryArguments<T>;
  data: IDiscoveryPreview[];
  title: string;
  icon?: SpecificIconProps;
  showSeeAll?: boolean;
}

export interface IDiscoveryMiniCarousel<T> extends Omit<IDiscoveryCarousel<T>, 'queryArguments'> {
  type?: "cuisine"
  shopType?: "restaurant" | "grocery"
  isMini?: boolean;
  queryArguments?: TQueryArguments<T>;
}
