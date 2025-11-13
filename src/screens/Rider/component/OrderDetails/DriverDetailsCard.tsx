import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';
import { View, Text, ImageSourcePropType, Image } from 'react-native';

interface DriverDetailsCardProps {
  name: string;
  image: string;
  rating: number;
  numberOfRides: number;
  car: {
    name: string;
    plateNumber: string;
  };
}

const DriverDetailsCard = ({ details }: { details: DriverDetailsCardProps }) => {
  return (
    <View className="py-3 gap-3">
      <CustomText lightColor="#71717A" darkColor="#71717A" fontSize="md">
        Driver details
      </CustomText>

      <View className="flex-row items-center gap-3 justify-between">
        <Image source={{ uri: details.image }} className="w-20 h-20 rounded-full" resizeMode="contain" />
        <View className="justify-start">
          <CustomText fontWeight="medium">{details.name}</CustomText>

          {/* rating info */}
          <View className="flex-row items-center gap-2">
            <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(18), color: '#FBC02D' }} />
            <CustomText fontSize="sm">{details.rating}</CustomText>
            <CustomText lightColor="#71717A" darkColor="#71717A" fontSize="sm">
              ({details.numberOfRides} rides)
            </CustomText>
          </View>

          {/* car details */}
          <View className="flex-row items-center gap-2">
            <CustomText fontSize="sm" fontWeight="medium" lightColor="#71717A" darkColor="#71717A">
              {details.car.name}
            </CustomText>
            <CustomIcon icon={{ type: 'Entypo', name: 'dot-single', size: adjust(18), color: '#71717A' }} />
            <CustomText fontSize="sm">{details.car.plateNumber}</CustomText>
          </View>
        </View>
        <CustomIcon icon={{ type: 'Entypo', name: 'chevron-thin-right', size: adjust(18), color: '#27272A' }} />
      </View>
    </View>
  );
};

export default DriverDetailsCard;
