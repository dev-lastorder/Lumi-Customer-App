import { Href, RelativePathString } from 'expo-router';
import { IBannner } from '@/screens/discovery/components/banner/interface';

// Methods
import { getValueOrDefault } from './get-value-or-default';

// Constants
import { DETAILS_ROUTE_BASED_ON_SHOP_TYPE } from '../constants';

export function onGetBannerNavigation(banner: IBannner): Href {
  switch (banner.action) {
    case 'Navigate Specific Restaurant':
      return {
        pathname: getValueOrDefault(
          DETAILS_ROUTE_BASED_ON_SHOP_TYPE,
          banner?.shopType?.toLowerCase() ?? '',
          '/restaurant-details'
        ) as RelativePathString,
        params: { id: banner.screen ?? '' },
      };

    case 'Navigate Specific Page':
      return {
        pathname: '/',
        params: {},
      };
    default:
      return {
        pathname: '/',
        params: {},
      };
  }
}
