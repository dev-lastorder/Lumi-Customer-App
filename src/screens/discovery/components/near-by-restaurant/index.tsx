import { View } from 'react-native';

// Components
import { DiscoveryCarousel, DiscoveryMiniCarousel } from '@/components';

// Interface
import { IDiscoveryNearbyRestaurantPreviewComponent } from '../interface';
import adjust from '@/utils/helpers/adjust';

export default function DiscoveryNearByRestaurant<T>(props: IDiscoveryNearbyRestaurantPreviewComponent<T>) {
  // Props
  const {
    gap,
    data: { restaurants, cuisines },
    queryArguments
  } = props;


  return (
    <View style={{gap:gap}}>
      <DiscoveryMiniCarousel data={cuisines} title="I feel like eating..."/>
      <DiscoveryCarousel data={restaurants} title="Restaurants near you" icon={{ name: 'utensils', type: 'FontAwesome5' }} queryArguments={queryArguments}/>
    </View>
  );
}
