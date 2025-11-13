// GQL
import { GET_ALL_TICKETS } from '@/api/graphql/query/support-ticket';

// Components
import { CustomIconButton, CustomPaddedView, CustomText, ScreenHeader } from '@/components';

// Hooks
import { useAppSelector } from '@/redux';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';

// Icons
import { MaterialIcons } from '@expo/vector-icons';

// React Native
import { useThemeColor } from '@/hooks';
import { Image, TouchableOpacity, View } from 'react-native';

export default function HelpHeader() {
  // Hooks
  const appTheme = useThemeColor();
  const userId = useAppSelector((state) => state.auth.user.userId);
  const name = useAppSelector((state) => state.auth.user.name);
  const router = useRouter();

  // Queries
  const { data: tickets } = useQuery(GET_ALL_TICKETS, { variables: { input: { userId } } });

  return (
    <CustomPaddedView className="gap-1 bg-background dark:bg-dark-background d-flex items-center justify-center">
      <View className="flex flex-row justify-between items-center bg-background dark:bg-dark-background">
        <CustomText className='text-center'>Hi {name}!👋</CustomText>
        {tickets?.getSingleUserSupportTickets?.docsCount ? (
          <TouchableOpacity
            className="items-center flex-row gap-1"
            onPress={() => {
              router.back();
              router.push('/(food-delivery)/(profile)/tickets');
            }}
          >
            <CustomText variant="label" style={{ color: appTheme.primary }}>
              My tickets({tickets?.getSingleUserSupportTickets?.docsCount})
            </CustomText>
            <MaterialIcons name="dataset-linked" size={24} color={'green'} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <ScreenHeader title="How can we help?" />
      <View
        className="rounded-2xl items-center justify-center my-8 px-6 py-8 w-full"
        style={{
          backgroundColor: appTheme.card,
          shadowColor: appTheme.primary,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Image
          source={require('@/assets/images/basket.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <View className=' mt-7'>
          <TouchableOpacity onPress={() => router.navigate("/discovery")} className='bg-primary rounded-md px-4 py-2'>
            <CustomText fontSize='xs' darkColor='white' lightColor='white' fontWeight='medium'  >Start Shopping</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </CustomPaddedView>
  );
}
