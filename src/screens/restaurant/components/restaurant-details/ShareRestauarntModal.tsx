// import * as Clipboard from 'expo-clipboard';
import { Modal, Platform, Pressable, Share, Text, ToastAndroid, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface ShareRestaurantModalProps {
  isVisible: boolean;
  onClose: () => void;
  restaurantId: string;
}

export default function ShareRestaurantModal({
  isVisible,
  onClose,
  restaurantId,
}: ShareRestaurantModalProps) {
  // Deep link to restaurant detail screen
//   const deepLink = `enategamultivendor://(food-delivery)/(restaurant)/restaurant-details`;
const deepLink = `exp://192.168.0.124:8081/--/(food-delivery)/(restaurant)/restaurant-details`;

  const handleCopyLink = async () => {
    // await Clipboard.setStringAsync(deepLink);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
    } else {
      alert('Link copied to clipboard');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this restaurant:\n${deepLink}`,
        url: deepLink,
      });
    } catch (error) {
      
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl items-center shadow-md w-11/12 max-w-md">
          <Text className="mb-4 font-semibold text-lg text-gray-700">
            Scan to View Restaurant
          </Text>

          <QRCode value={deepLink} size={200} />

          <View className="mt-6 w-full space-y-3">
            <Pressable
              className="bg-blue-500 py-4 my-1 rounded-xl items-center"
              onPress={handleCopyLink}
            >
              <Text className="text-white font-medium">Copy Link</Text>
            </Pressable>

            <Pressable
              className="bg-green-500 py-4 my-1 rounded-xl items-center"
              onPress={handleShare}
            >
              <Text className="text-white font-medium">Share</Text>
            </Pressable>

            <Pressable
              className="bg-gray-300 py-4 my-1 rounded-xl items-center"
              onPress={onClose}
            >
              <Text className="text-gray-800 font-medium">Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
