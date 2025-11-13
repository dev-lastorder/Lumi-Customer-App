import { View } from 'react-native';

// Components
import { DiscoveryCarousel } from '@/components';

// Interface
import { IDiscoveryRecentOrderRestaurantPreviewComponent } from '../interface';

// HOC
// import { withAuthGuard } from '@/hoc';

function DiscoveryRecentOrderRestaurants<T>(props: IDiscoveryRecentOrderRestaurantPreviewComponent<T>) {
  const { data, queryArguments } = props;
  if (!data?.length) {
    return <></>;
  }
  return <DiscoveryCarousel data={data || []} title="Recent Order Restaurants" queryArguments={queryArguments || {}} />;
}

// export default withAuthGuard(DiscoveryRecentOrderRestaurants);
export default DiscoveryRecentOrderRestaurants;
