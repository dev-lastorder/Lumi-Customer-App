import { View, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { CustomText } from '@/components';

interface RideDetailsCardProps {
  type: string;
  price: string;
  image: ImageSourcePropType;
}

const RideDetailsCard = ({ details }: { details: RideDetailsCardProps }) => {
  return (
    <View className="flex-row justify-between items-center py-2">
      <View className="flex-row items-center gap-4">
        <Image source={details.image} className="w-20 h-20" resizeMode="contain" />
        <CustomText fontSize="md" fontWeight="medium">
          {details.type}
        </CustomText>
      </View>
      <CustomText fontSize="md" fontWeight="medium">
        {details.price}
      </CustomText>
    </View>
  );
};

export default RideDetailsCard;
