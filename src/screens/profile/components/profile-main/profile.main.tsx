// Components
import { CustomPaddedView, CustomText, LoadingPlaceholder, RestaurantStoreCard, ScreenHeader, ScreenNavigator } from '@/components';
import ScreenSubHeader from '@/components/common/ScreenSubHeader';

// Constants
import { demoFavRestaurants, profileRoutes } from '../../constant';

// Expo
import { Href, useRouter } from 'expo-router';

// React Native
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';


// Interfaces
import { useThemeColor } from '@/hooks';
import { Restaurant, SpecificIconProps } from '@/utils/interfaces';

// Query & Mutation
import { useQuery } from '@apollo/client';
import { GET_USER_FAVOURITE } from '@/api';
import { SCREEN_WIDTH } from '@/utils';
import adjust from '@/utils/helpers/adjust';

// Shopify
export default function ProfileMain() {

  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const { data: favourites, loading, error, refetch } = useQuery(GET_USER_FAVOURITE);




  useEffect(() => {
    refetch();
  }, [user.favourite]);



  const onPressItem = (id: string, shopType: string) => {
    const shopTypePath: '/restaurant-details' | '/store-details' = shopType === 'restaurant' ? '/restaurant-details' : '/store-details';
    router.navigate(
      {
        pathname: shopTypePath,
        params: {
          id: id,
        },
      });
  };






  // Hooks
  const appTheme = useThemeColor();
  return (
    <ScrollView className='bg-background dark:bg-dark-background ' contentContainerStyle={{ flexGrow: 1, gap: 32 }}>
      {/* Quick Links  */}
      <View>
        {profileRoutes.map((data, profileIndex) => {
          return (
            <CustomPaddedView
              paddingHorizontal={16}
              padding={0}
              paddingVertical={16}
              key={String(profileIndex) + 'Profile_Main_Section'}
              className={`${data.screenHeader === '' || data.screenHeader === 'Quick Links' ? ' mx-auto' : ''}`}
            >
              {data.screenHeader?.length > 0 && <ScreenSubHeader title={data.screenHeader} />}

              <View className={`${data.screenHeader === '' || data.screenHeader === 'Quick Links' ? 'border-gray-300 dark:border-dark-border/30 rounded-lg border-[0.5px] p-3 mt-4' : ''}`}>
                {data.routes.map((route, routeIndex) => {
                  return (
                    <ScreenNavigator
                      key={routeIndex}
                      icon={route.icon}
                      iconType={route.iconType as unknown as SpecificIconProps}
                      link={route.route as Href}
                      title={route.title}
                      isLast={!!route.isLast}
                    />
                  );
                })}
              </View>
              {!data?.screenHeader && !!favourites?.userFavourite?.length && (
                <View className="flex justify-between items-center w-full  mt-10  gap-4">
                  <View className="flex flex-row items-center justify-between w-full">
                    <ScreenSubHeader title={'Your favourites'} />

                    <View className="bg-primary/10 rounded-lg p-3">
                      <TouchableOpacity onPress={() => router.navigate("/all-favourites")}>
                        <CustomText variant="label" fontWeight="semibold" className='text-primary' isDefaultColor={false}>
                          See all
                        </CustomText>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <FlatList
                    contentContainerStyle={{ backgroundColor: appTheme.background, gap: 10, flexGrow: 1 }}
                    data={favourites?.userFavourite}
                    renderItem={({ item }) => <View style={{ width: SCREEN_WIDTH - adjust(32) }}><RestaurantStoreCard item={item} onPress={() => onPressItem(item._id, item?.shopType)} /></View>}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    horizontal
                    onEndReachedThreshold={0.5}
                  />
                </View>
              )}
            </CustomPaddedView>
          );
        })}
      </View>
    </ScrollView>
  );
}
