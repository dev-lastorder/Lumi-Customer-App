import { View } from 'react-native';

// Components
import { DiscoveryMiniCarousel } from '@/components';

// Interface
import { IDiscoveryOurBrandsPreviewComponent } from '../interface';

function DiscoveryOurBrands<T>(props: IDiscoveryOurBrandsPreviewComponent<T>) {
  const { data, queryArguments } = props;

  return <DiscoveryMiniCarousel isMini={true} data={data} title="Our Brands" queryArguments={queryArguments} showSeeAll={true}/>
}

export default DiscoveryOurBrands;
