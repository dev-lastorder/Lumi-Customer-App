// Components
import { CustomIcon, CustomPaddedView, CustomText } from '@/components';
import HelpAccordian from './help-accordian';

// Utils
import { FAQs } from '@/utils';

// Icons
import { FontAwesome } from '@expo/vector-icons';

// React Native
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native';

// Hooks
import { useThemeColor } from '@/hooks';
import { useRouter } from 'expo-router';

export default function HelpMain() {
  // Hooks
  const router = useRouter();
  const appTheme = useThemeColor()
  // Handlers
  const openWhatsAppStore = () => {
    const appStoreUrl = 'https://apps.apple.com/app/whatsapp-messenger/id310633997';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.whatsapp';

    const storeUrl = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

    Linking.canOpenURL(storeUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(storeUrl);
        } else {
          ;
        }
      })
      .catch((err) => console.error('An error occurred while opening the store:', err));
  };

  const openWhatsAppChat = async () => {
    try {
      const phoneNumber = '+1(307)776%E2%80%918999';

      if (Platform.OS === 'android') {
        const androidUrl = `whatsapp://send?phone=${phoneNumber}`;
        const status = await Linking.openURL(androidUrl);

        if (!status) {
          openWhatsAppStore();
        }
      } else if (Platform.OS === 'ios') {
        const iosUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;

        const supported = await Linking.canOpenURL(iosUrl);
        if (supported) {
          await Linking.openURL(iosUrl);
        } else {
          openWhatsAppStore();
        }
      }
    } catch (error) {
      ;
      openWhatsAppStore();
    }
  };
  return (
    <CustomPaddedView className='bg-background flex-1 d-flex justify-between dark:bg-dark-background d-flex ' style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
      <View>
        {FAQs.map((faq) => {
          return (
            <HelpAccordian heading={faq.heading} key={faq.id}>
              <CustomText variant='label' fontSize='xs'>{faq.description}</CustomText>
            </HelpAccordian>
          );
        })}
      </View>
      <View>
        <View className="w-full flex items-center mt-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-14 w-[92%] rounded-full bg-green-500 flex flex-row items-center justify-center gap-2 shadow-sm"
            onPress={openWhatsAppChat}
          >
            <FontAwesome name="whatsapp" size={24} color="white" />
            <CustomText variant='label' fontWeight='semibold' fontSize='sm' style={{ color: "white" }}>Contact on whatsapp</CustomText>
          </TouchableOpacity>
        </View>
        <View className="w-full flex items-center mt-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-14 w-[92%] rounded-full flex flex-row items-center justify-center gap-2 shadow-sm  bg-primary/70"
            onPress={() => router.push('/(food-delivery)/(profile)/select-help-type')}
          >
            <CustomIcon icon={{ name: "comment", type: "FontAwesome5", size: 24 }} className='text-white' />
            <CustomText variant='label' fontWeight='semibold' fontSize='sm' style={{ color: "white" }}>Chat with a person</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </CustomPaddedView>
  );
}
