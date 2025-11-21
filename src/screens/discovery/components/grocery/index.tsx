import { View } from 'react-native';

// Components
import { DiscoveryCarousel, DiscoveryMiniCarousel } from '@/components';

// Interface
import { IDiscoveryGroceryListPreviewComponent } from '../interface';
import adjust from '@/utils/helpers/adjust';

export default function DiscoveryGrocery<T>(props: IDiscoveryGroceryListPreviewComponent<T>) {
  const {
    gap = adjust(32),
    data: { restaurants, cuisines },
    queryArguments
  } = props;

  return (
  <View style={{gap:gap}}>
      <DiscoveryMiniCarousel data={cuisines} title="Fresh finds await...." type='cuisine' shopType='grocery'/>
      <DiscoveryCarousel data={restaurants} title="Grocery List" icon={{ name: 'shoppingcart' }} queryArguments={queryArguments} />
    </View>
  );
}
