
import { GET_USER_FAVOURITE } from '@/api';
import { CustomText, LoadingPlaceholder, NoData, RestaurantStoreCard, ScreenHeader } from '@/components';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';
import { useThemeColor } from '@/hooks';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';
import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import React from 'react';
import { View, FlatList } from 'react-native';

import { ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';


const AllFavouritesScreen = () => {
    const { data: favourites, loading, error, refetch } = useQuery(GET_USER_FAVOURITE);
    const appTheme = useThemeColor()

    console.log(JSON.stringify(favourites?.userFavourite))


    return (
        <ScreenWrapperWithAnimatedTitleHeader title="All Favourites">
            <View className='ps-4'>

                <ScreenHeader title='All Favourites' />
            </View>
            {loading ? (
                <Animated.View className="flex-1 justify-center items-center mt-10">
                    <LoadingPlaceholder />
                    <CustomText fontSize="md" className="mt-4" style={{ color: appTheme.textSecondary }}>
                        Loading order details...
                    </CustomText>
                </Animated.View>
            ) : error ? (
                <DisplayErrorCard message={error?.message || 'Unable to fetch the order. Please try again.'} />
            ) : favourites?.userFavourite?.length > 0 ? (
                <Animated.View className="">
                    <FlatList
                        data={favourites?.userFavourite}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View className="p-2">
                                <RestaurantStoreCard
                                    item={item}
                                    onPress={() => {
                                        let shopTypePath: '/restaurant-details' | '/store-details' = item?.shopType === 'restaurant' ? '/restaurant-details' : '/store-details';
                                        router.navigate(
                                            {
                                                pathname: shopTypePath,
                                                params: {
                                                    id: item?._id,
                                                },
                                            });
                                    }}
                                />
                            </View>
                        )}
                        contentContainerClassName="p-4"
                    />
                </Animated.View>) : <NoData imageSource={require('@/assets/images/no-coupons-found.png')} title='No data Found' description={'Unable to fetch the favourites. Please try again.'} />}

        </ScreenWrapperWithAnimatedTitleHeader>
    );
};

export default AllFavouritesScreen;
