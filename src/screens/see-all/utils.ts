import { IDiscoveryPreview, safeArray } from "@/utils";


export interface QueryArguments {
  [key: string]: {
    variables: any;
  };
}

export const getQueryKey = (queryArguments: QueryArguments): string => {
  const [key] = Object.entries(queryArguments)[0] || [];
  return key;
};

export const transformRestaurantData = (restaurants: any, queryArguments: QueryArguments): IDiscoveryPreview[] => {
  const { recentOrderRestaurants, mostOrderRestaurants, nearByRestaurants, topRatedVendors } = restaurants;
  const key = getQueryKey(queryArguments);

  switch (key) {
    case 'RecentOrderRestaurants':
      return safeArray(recentOrderRestaurants?.data);
    case 'MostOrderRestaurants':
      return safeArray(mostOrderRestaurants?.data?.all?.restaurants).length > 0
        ? safeArray(mostOrderRestaurants?.data?.all?.restaurants)
        : safeArray(mostOrderRestaurants?.data?.groceryorders?.restaurants);
    case 'NearByRestaurants':
      return safeArray(nearByRestaurants?.data?.restaurantorders?.restaurants).length > 0
        ? safeArray(nearByRestaurants?.data?.restaurantorders?.restaurants)
        : safeArray(nearByRestaurants?.data?.groceryorders?.restaurants);
    case 'TopRatedVendors':
      const shopTypeLength = queryArguments?.TopRatedVendors?.variables?.shopType?.length;
      if (shopTypeLength === 2) {
        return safeArray(topRatedVendors?.data?.all?.restaurants);
      }
      return safeArray(topRatedVendors?.data?.restaurantorders?.restaurants).length > 0
        ? safeArray(topRatedVendors?.data?.restaurantorders?.restaurants)
        : safeArray(topRatedVendors?.data?.groceryorders?.restaurants);
    default:
      return [];
  }
};



export const deduplicateItems = (existingItems: IDiscoveryPreview[], newItems: IDiscoveryPreview[]): IDiscoveryPreview[] => {
  const existingIds = new Set(existingItems.map(item => item._id));
  const uniqueNewItems = newItems.filter(item => !existingIds.has(item._id));
  return [...existingItems, ...uniqueNewItems];
};