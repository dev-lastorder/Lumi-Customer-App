import { View } from 'react-native';

// Components
import { DiscoveryCarousel } from '@/components';

// Interface
import { IDiscoveryTopGroceryPickPreviewComponent } from '../interface';

function DiscoveryTopGroceriesPick<T>(props: IDiscoveryTopGroceryPickPreviewComponent<T>) {
  const { data, queryArguments } = props;

  return (
    <View>
      <DiscoveryCarousel data={data} title="Top Groceries Pick" icon={{ name: 'store', type: 'FontAwesome5' }} queryArguments={queryArguments}/>
    </View>
  );
}

export default DiscoveryTopGroceriesPick;
