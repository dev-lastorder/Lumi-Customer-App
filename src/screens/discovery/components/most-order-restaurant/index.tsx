import { View } from 'react-native';

// Components
import { DiscoveryCarousel } from '@/components';

// Interface
import { IDiscoveryPopularRestaurantPreviewComponent } from '../interface';

function DiscoveryMostOrderRestaurants<T>(props: IDiscoveryPopularRestaurantPreviewComponent<T>) {
  // Props
  const { data, queryArguments } = props;

    if (!data?.length) {
    return <></>;
  }

  return  <DiscoveryCarousel data={data} title="Popular right now" queryArguments={queryArguments}/>

}

export default DiscoveryMostOrderRestaurants;
