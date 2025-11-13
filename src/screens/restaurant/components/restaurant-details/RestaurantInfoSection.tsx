import { CustomIcon, CustomText } from '@/components';
import { getRestaurantStatus } from '@/utils';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RestaurantInfoSectionProps } from './interfaces';
import ShareResaurantModal from './ShareRestauarntModal';
import { useRouter } from 'expo-router';

const RestaurantInfoSection: React.FC<RestaurantInfoSectionProps> = ({ onLayout, restaurantData }) => {
  // const router= useRouter();
  // States
  const [isShareModalOpen, setIsShareModaOpen] = useState(false);

  // Hooks
  const router = useRouter();

  if (!restaurantData) return null;

  const { name, shopType, reviewAverage, deliveryTime, openingTimes, minimumOrder, deliveryInfo, _id } = restaurantData;

  return (
    <View>
      <View
        className="py-6 bg-background dark:bg-dark-background"
        style={{
          borderTopEndRadius: '100%',
          borderTopStartRadius: '100%',
          width: '100%',
        }}
      />

      <View onLayout={onLayout} className="p-4 bg-background dark:bg-dark-background">
        {/* Restaurant Name */}
        <CustomText variant="heading1" fontWeight="bold" fontSize="2xl" className="text-text dark:text-white mb-2 text-center" isDefaultColor={false}>
          {name}
        </CustomText>

        {/* Rating, Open Until, Min. Order Row */}
        <View className="flex-row items-center justify-center gap-1">
          <CustomIcon icon={{ name: 'smile', type: 'Feather', size: 16 }} />
          <CustomText fontSize="sm" isDefaultColor={false}>
            {reviewAverage}
          </CustomText>
          <CustomText fontSize="sm">•</CustomText>
          <CustomText fontSize="sm">{getRestaurantStatus(openingTimes)}</CustomText>
          <CustomText fontSize="sm">•</CustomText>
          <CustomText fontSize="sm">Min. order {minimumOrder} €</CustomText>
        </View>

        {/* Delivery Fee and More Info Row */}
        <View className="flex-row items-center justify-center gap-1 mb-5">
          {deliveryInfo?.minDeliveryFee && (
            <>
              <CustomIcon icon={{ name: 'truck', type: 'Feather', size: 16 }} />
              <CustomText fontSize="sm" isDefaultColor={false}>
                {deliveryInfo.minDeliveryFee} €
              </CustomText>
            </>
          )}
          <CustomText fontSize="sm">•</CustomText>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: shopType === 'restaurant' ? '/restaurant-more-info' : '/store-more-info',
                params: { info: JSON.stringify(restaurantData) },
              })
            }
          >
            <CustomText fontWeight="semibold" fontSize="sm" className="text-primary dark:text-primary-light" isDefaultColor={false}>
              More
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Delivery Button and Action Buttons */}
        <View className="flex-row justify-center gap-2">
          {/* Delivery Button */}
          <TouchableOpacity
            className="bg-icon-background dark:bg-dark-icon-background flex-row items-center py-3 justify-center px-3 rounded-lg flex-1"
            onPress={() => {}}
          >
            <CustomIcon icon={{ name: 'truck', type: 'Feather', size: 16 }} className="text-text dark:text-dark-text" />
            <CustomText variant="body" className=" ml-2" fontFamily="Inter">
              Delivery time {deliveryTime} min
            </CustomText>
          </TouchableOpacity>

          {/* Users Button */}
          <TouchableOpacity
            className="bg-icon-background dark:bg-dark-icon-background px-3  py-3 rounded-lg items-center justify-center"
            onPress={() => router.push(`/(food-delivery)/(store)/order-details`)}
          >
            <CustomIcon icon={{ name: 'users', type: 'Feather', size: 16 }} className="text-text dark:text-dark-text" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity className="bg-primary/10 p-3 rounded-lg items-center justify-center" onPress={() => setIsShareModaOpen(true)}>
            <CustomIcon icon={{ name: 'share-2', type: 'Feather', size: 20 }} className="text-primary " />
          </TouchableOpacity>
        </View>
      </View>
      <ShareResaurantModal isVisible={isShareModalOpen} onClose={() => setIsShareModaOpen(false)} restaurantId={_id} />
    </View>
  );
};

export default RestaurantInfoSection;
