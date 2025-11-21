// components
import { CustomHeader } from '@/components';
import {
  RestaurantMoreInfoAddress,
  RestaurantMoreInfoContactInfo,
  RestaurantMoreInfoDeliveryInfo,
  RestaurantMoreInfoHeaderInfo,
  RestaurantMoreInfoHours,
} from '../components/restaurant-more-info';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';

const RestaurantMoreInfoScreen = () => {
  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* header */}
      <CustomHeader title={''} showGoBack={true} onGoBack={() => router.back()} rightIcons={[]} />

      {/* content */}
      <ScrollView className="p-4">
        <View>
          {/* Restaurant Name & Description */}
          <RestaurantMoreInfoHeaderInfo />
          {/* Seller & Address Details */}
          <RestaurantMoreInfoAddress />
          {/* Opening Hours Section */}
          <RestaurantMoreInfoHours />
          {/* Delivery Information & Map */}
          <RestaurantMoreInfoDeliveryInfo />
          {/* Contact Info Section */}
          <RestaurantMoreInfoContactInfo />
        </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantMoreInfoScreen;
