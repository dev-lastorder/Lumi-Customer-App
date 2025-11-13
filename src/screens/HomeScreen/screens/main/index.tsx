/* cspell:word restaurantorders, groceryorders */

import { useEffect, useMemo, useState } from 'react';

// API & Redux
import { useRestaurants } from '@/api';
import { RootState, useAppSelector } from '@/redux';

// Components
import {
  DiscoveryShopTypes,
  DiscoveryBanner,
  DiscoveryGrocery,
  DiscoveryMostOrderRestaurants,
  DiscoveryNearByRestaurant,
  DiscoveryRecentOrderRestaurants,
  DiscoveryTopGroceriesPick,
  DiscoveryOurBrands,
  DiscoveryTopRatedGroceries,
  DiscoveryTopRatedRestaurants,
} from '@/screens/discovery/components';
import { LoadingPlaceholder, ScreenWrapperWithAnimatedHeader } from '@/components';
import ActiveOrdersFAB from '@/components/features/FloatingActionButton';

import { IDiscoveryPreview, IDiscoveryMiniPreview } from '@/utils/interfaces/global';
import adjust from '@/utils/helpers/adjust';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import RiderIndex from '@/screens/Rider/screen/RiderIndex';
import HomeScreenBanner from '../../component/banner';
import HomeScreenCards from '../../component/card';
import { webSocketService } from '@/services/websocketService';
import { useSelector } from 'react-redux';
import { rideRequestsService } from '@/screens/Rider/utils/rideRequestService';
import CustomerRide from '@/app/(ride)/customer-ride';


type ShopType = 'restaurant' | 'grocery';

interface IOrderData {
  restaurants: IDiscoveryPreview[];
  cuisines?: IDiscoveryMiniPreview[];
}

interface IUseRestaurantsData {
  recentOrderRestaurants?: { data?: IDiscoveryPreview[] };
  mostOrderRestaurants?: {
    data?: {
      all?: { restaurants?: IDiscoveryPreview[] };
      groceryorders?: { restaurants?: IDiscoveryPreview[] };
    };
  };
  nearByRestaurants?: {
    data?: {
      restaurantorders?: IOrderData;
      groceryorders?: IOrderData;
    };
  };
  topRatedVendors?: {
    data?: {
      restaurantorders?: IOrderData;
      groceryorders?: IOrderData;
    };
  };
}

interface IFetchVariables {
  latitude: number;
  longitude: number;
  shopType?: ShopType[];
}

interface ISingleFetchArgument {
  skip?: boolean;
  variables?: IFetchVariables;
}

type IFetchArguments = Partial<
  Record<'recentOrderRestaurants' | 'mostOrderRestaurants' | 'nearByRestaurants' | 'topRatedVendors', ISingleFetchArgument>
>;

const FALL_BACK_LOCATION = {
  latitude: 33.6159214,
  longitude: 73.1467615,
};

// --- Utilities / Services ---
const mapDiscoveryData = (apiData: IUseRestaurantsData) => {
  const { recentOrderRestaurants, mostOrderRestaurants, nearByRestaurants, topRatedVendors } = apiData;

  return {
    recentRestaurants: recentOrderRestaurants?.data ?? [],
    mostOrdered: {
      restaurants: mostOrderRestaurants?.data?.all?.restaurants ?? [],
      groceries: mostOrderRestaurants?.data?.groceryorders?.restaurants ?? [],
    },
    nearby: {
      restaurants: nearByRestaurants?.data?.restaurantorders?.restaurants ?? [],
      cuisines: nearByRestaurants?.data?.restaurantorders?.cuisines ?? [],
      groceries: nearByRestaurants?.data?.groceryorders?.restaurants ?? [],
      groceryCuisines: nearByRestaurants?.data?.groceryorders?.cuisines ?? [],
    },
    topRated: {
      restaurants: topRatedVendors?.data?.restaurantorders?.restaurants ?? [],
      groceries: topRatedVendors?.data?.groceryorders?.restaurants ?? [],
    },
  };
};

const prepareFetchArgs = (baseFetchArgs: IFetchArguments | undefined) => {
  const { recentOrderRestaurants, mostOrderRestaurants, nearByRestaurants, topRatedVendors } = baseFetchArgs ?? {};
  const overrideVariables = (args: ISingleFetchArgument | undefined, shopType: ShopType[]) => ({
    skip: args?.skip ?? false,
    variables: { ...args?.variables, shopType },
  });

  return {
    recentOrderRestaurants: { RecentOrderRestaurants: { skip: recentOrderRestaurants?.skip ?? false, ...recentOrderRestaurants } },
    mostOrderRestaurants: {
      MostOrderRestaurants: overrideVariables(mostOrderRestaurants, ['restaurant']),
    },
    nearByRestaurant: {
      NearByRestaurants: overrideVariables(nearByRestaurants, ['restaurant']),
    },
    nearByGrocery: {
      NearByRestaurants: overrideVariables(nearByRestaurants, ['grocery']),
    },
    topGroceriesPick: {
      MostOrderRestaurants: overrideVariables(mostOrderRestaurants, ['grocery']),
    },
    ourBrands: { TopRatedVendors: overrideVariables(topRatedVendors, []) },
    topRatedRestaurants: {
      TopRatedVendors: overrideVariables(topRatedVendors, ['restaurant']),
    },
    topRatedGroceries: {
      TopRatedVendors: overrideVariables(topRatedVendors, ['grocery']),
    },
  };
};

// --- Custom Hooks ---
// A lean hook to fetch and prepare all data needed for the Discovery screen.

const useDiscoveryData = () => {
  const token = useAppSelector((state) => state.auth.token);
  const latitude = useAppSelector((state) => state.locationPicker.latitude);
  const longitude = useAppSelector((state) => state.locationPicker.longitude);

  const queryArguments = useMemo(() => {
    const parsedLat = latitude ? parseFloat(latitude) : FALL_BACK_LOCATION.latitude;
    const parsedLong = longitude ? parseFloat(longitude) : FALL_BACK_LOCATION.longitude;

    return {
      RecentOrderRestaurants: {
        skip: !token,
        variables: {
          latitude: parsedLat,
          longitude: parsedLong,
        },
      },
      MostOrderRestaurants: {
        skip: false,
        variables: {
          latitude: parsedLat,
          longitude: parsedLong,
          shopType: ['restaurant', 'grocery'], // inferred as ShopType[]
        },
      },
      NearByRestaurants: {
        skip: false,
        variables: {
          latitude: parsedLat,
          longitude: parsedLong,
          shopType: ['restaurant', 'grocery'],
        },
      },
      TopRatedVendors: {
        skip: false,
        variables: {
          latitude: parsedLat,
          longitude: parsedLong,
          shopType: ['restaurant', 'grocery'],
        },
      },
    };
  }, [token, latitude, longitude]);


  const { fetchArguments, ...apiData } = useRestaurants({ queryArguments });

  const data = useMemo(() => mapDiscoveryData(apiData), [apiData]);
  const fetchArgs = useMemo(() => prepareFetchArgs(fetchArguments), [fetchArguments]);

  const isLoading = useMemo(() => {
    return (
      apiData.recentOrderRestaurants?.loading ||
      apiData.mostOrderRestaurants?.loading ||
      apiData.nearByRestaurants?.loading ||
      apiData.topRatedVendors?.loading
    );
  }, [
    apiData.recentOrderRestaurants?.loading,
    apiData.mostOrderRestaurants?.loading,
    apiData.nearByRestaurants?.loading,
    apiData.topRatedVendors?.loading,
  ]);

  return { data, fetchArgs, isLoading };
};

// --- Main Component ---

const HomePageMainScreen = () => {
  const { data, fetchArgs, isLoading } = useDiscoveryData();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.authSuperApp.user?.id);
  console.log("currentUserId", userId);
  const [rideDataExist, setRideDataExist] = useState(false)


  useEffect(() => {
    const fetchActiveRide = async () => {
      const activeRide = await rideRequestsService.getActiveRide();
      console.log("🚗 Current active ride:", activeRide);
      if (activeRide?.isActiveRide === false) {
        setRideDataExist(activeRide?.isActiveRide);
      } else if (activeRide && !activeRide?.isActiveRide) {
        // Means the key is missing but ride data exists
        setRideDataExist(true);
      } else {
        setRideDataExist(!!activeRide);
      }
    };

    fetchActiveRide();
  }, [rideDataExist]);


  useEffect(() => {
    if (userId) {
      console.log('🔑 Connecting WebSocket for userId:', userId);

      webSocketService
        .connect(userId)
        .then(() => console.log('✅ WebSocket connected successfully'))
        .catch((error) => console.error('❌ WebSocket connection failed:', error));

      const unsubscribeMessage = webSocketService.onMessage((message) => {
        console.log('📩 Message received in App:', message);
      });

      const unsubscribeConnection = webSocketService.onConnectionChange((connected) => {
        console.log('🌐 WebSocket connection status changed:', connected);
      });

      return () => {
        console.log('👋 Cleaning up WebSocket connection');
        unsubscribeMessage();
        unsubscribeConnection();
        webSocketService.disconnect();
      };
    }
  }, [userId]);


  const gap = adjust(20);
  if (isLoading) {
    return <LoadingPlaceholder placeholder={'loading ...'} />;
  }


  const onCartPress = () => {
    router.push('/(food-delivery)/(discovery)/cart');
  };


  return (
    <>
      {rideDataExist ? (

        <>
          <CustomerRide rideDataExist={rideDataExist} />
        </>


      ) : (

        <>
          <ScreenWrapperWithAnimatedHeader
            title="Home"
            contentContainerStyle={{ flexGrow: 1, marginTop: gap, gap: gap, paddingBottom: gap }}
            showCart={true}
            onCartPress={onCartPress}
            showMap={false}
            showSettings={false}
          >
            {/* <DiscoveryShopTypes title="Categories" queryArguments={''} /> */}
            {/* 

        <RiderIndex /> */}
            <HomeScreenBanner />
            <HomeScreenCards />


            {/* <DiscoveryRecentOrderRestaurants
          data={data.recentRestaurants}
          queryArguments={fetchArgs.recentOrderRestaurants}
        /> */}

            {/* <DiscoveryMostOrderRestaurants
          data={data.mostOrdered.restaurants}
          queryArguments={fetchArgs.mostOrderRestaurants}
        /> */}


            {/* </View> */}
          </ScreenWrapperWithAnimatedHeader>

          <ActiveOrdersFAB />
        </>
      )

      }
    </>
  );
};

export default HomePageMainScreen;
