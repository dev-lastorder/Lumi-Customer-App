import { View } from 'react-native';

// Components
import { DiscoveryCarousel } from '@/components';

// Interface
import { IDiscoveryTopGroceryBrandPreviewComponent } from '../interface';

function DiscoveryTopRatedGroceries<T>(props: IDiscoveryTopGroceryBrandPreviewComponent<T>) {
  const { data, queryArguments } = props;

  return (
    <View>
      <DiscoveryCarousel data={data} title="Top Grocery Brands" queryArguments={queryArguments}/>
    </View>
  );
}

export default DiscoveryTopRatedGroceries;
