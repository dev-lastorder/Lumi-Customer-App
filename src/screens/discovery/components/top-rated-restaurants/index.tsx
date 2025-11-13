import { View } from 'react-native';

// Components
import { DiscoveryCarousel } from '@/components';

// Interface
import { IDiscoveryTopRestaurantBrandPreviewComponent } from '../interface';

function DiscoveryTopRatedRestaurants<T>(props: IDiscoveryTopRestaurantBrandPreviewComponent<T>) {
  const { data, queryArguments } = props;

  return (
    <View>
      <DiscoveryCarousel data={data} title="Top Restaurant Brands" queryArguments={queryArguments}/>
    </View>
  );
}

export default DiscoveryTopRatedRestaurants;
