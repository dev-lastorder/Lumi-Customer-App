import { CustomText, ScreenWrapperWithAnimatedHeader } from '@/components';
import RestaurantStoreMapView from '@/components/common/restaurantStoreMapView';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';
import { Restaurant } from '@/utils';
import { useQuery } from '@apollo/client';
import { GET_NEARBY_RESTAURANTS_AND_STORE } from '@/api/graphql/query/getNearbyRestaurantsAndStores';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';



const StoresMap = () => {
    const router = useRouter();
    const { location : { latitude, longitude } } = useLocationPicker();

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);


    const skipQuery = !(latitude && longitude);
    const { loading , error } = useQuery(GET_NEARBY_RESTAURANTS_AND_STORE, {
        variables: {
            input: {
                shopType: 'grocery',
                userLocation: {
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                },
                paginate : false 
            },
        },
        skip: skipQuery,
        onCompleted: ({ getNearbyRestaurantsOrStores }) => {
            const { restaurants } = getNearbyRestaurantsOrStores;
            setRestaurants(restaurants);
        },
        onError: (error) => {}
    });


    return (
        <ScreenWrapperWithAnimatedHeader
        onMapPress={() => {
            router.back()
        }}
        showGoBack
        showLocationDropdown={false}
        style={{ paddingBottom : 0 }}
        >
            {
                loading 
                ? 
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator 
                        size={'large'} 
                        />
                    </View>
                : 
                error 
                ?
                    <DisplayErrorCard 
                    message={` Error Message: ${error?.message || 'Something went wrong.'} `}
                    />
                :
                restaurants?.length > 0 
                ?
                    <RestaurantStoreMapView restaurants={restaurants} />
                : 
                    <Text>''</Text>
            }
        </ScreenWrapperWithAnimatedHeader>
    )
};

export default StoresMap