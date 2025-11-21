import { IGlobalComponentProps, IDiscoveryPreview, IDiscoveryMiniPreview, TQueryArguments } from '@/utils/interfaces';

export interface IDiscoveryPreviewComponent<T> extends IGlobalComponentProps {
  gap?:number;
  queryArguments: TQueryArguments<T>;
  data: IDiscoveryPreview[];
}

export interface IDiscoveryRecentOrderRestaurantPreviewComponent<T> extends Partial<IDiscoveryPreviewComponent<T>> {}
export interface IDiscoveryPopularRestaurantPreviewComponent<T> extends IDiscoveryPreviewComponent<T> {}
export interface IDiscoveryNearbyRestaurantPreviewComponent<T> extends Omit<IDiscoveryPreviewComponent<T>, 'data'> {
  data: {
    restaurants: IDiscoveryPreview[];
    cuisines: IDiscoveryMiniPreview[];
  };
}
export interface IDiscoveryGroceryListPreviewComponent<T> extends Omit<IDiscoveryPreviewComponent<T>, 'data'> {
  data: {
    restaurants: IDiscoveryPreview[];
    cuisines: IDiscoveryMiniPreview[];
  };
}
export interface IDiscoveryTopGroceryPickPreviewComponent<T> extends IDiscoveryPreviewComponent<T> {}
export interface IDiscoveryTopRestaurantBrandPreviewComponent<T> extends IDiscoveryPreviewComponent<T> {}
export interface IDiscoveryOurBrandsPreviewComponent<T> extends IDiscoveryPreviewComponent<T> {}
export interface IDiscoveryTopGroceryBrandPreviewComponent<T> extends IDiscoveryPreviewComponent<T> {}
