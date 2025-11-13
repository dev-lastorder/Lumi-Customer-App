import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';
import { Image } from 'react-native';
import { View } from 'react-native';

interface RideRoutesDetailsCardProps {
  startLocation: string;
  endLocation: string;
}

const RideRoutesDetailsCard = ({ details }: { details: RideRoutesDetailsCardProps }) => {
  return (
    <View className="py-4 gap-3">
      <CustomText lightColor="#71717A" darkColor="#71717A" fontSize="md">
        Your ride route
      </CustomText>

      <View className="flex-row items-center gap-3">
        <Image source={require('@/assets/images/toIcon.png')} className="w-5 h-5" resizeMode="contain" />

        <CustomText fontSize="md">{details.startLocation}</CustomText>
      </View>
      <View className="flex-row items-center gap-3">
        <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5" resizeMode="contain" />
        <CustomText fontSize="md">{details.endLocation}</CustomText>
      </View>
    </View>
  );
};

export default RideRoutesDetailsCard;
