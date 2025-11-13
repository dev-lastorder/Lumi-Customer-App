import { View, TouchableOpacity, Image, ScrollView, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather, Entypo } from '@expo/vector-icons'
import { CustomText } from '@/components'
import { router } from 'expo-router'
import OfferYourFare from './OfferYourFare'
import RideCard from './RideCard'
import { getDistanceMatrix, sendFareData } from '../utils/getDistanceMatrix'
import { useQuery } from '@apollo/client'
import { GET_CONFIGURATION } from '@/api'
import { RootState } from '@/redux'
import { useSelector, useDispatch } from 'react-redux'
import { setLastSelectedRide } from '@/redux/slices/RideSlices/rideSelectionSlice'
import { setRideDuration, setRideKm } from '@/redux/slices/RideSlices/rideCreationSlice'


const nameMap: Record<string, string> = {
    "4W_MINI": "Mini",
    "4W_SMALL": "Comfort",
    "4W_AC": "Premium",
    Courier: "Courier",
};

const RideFare = () => {

    const dispatch = useDispatch();

    const [offerModalVisible, setOfferModalVisible] = useState(false);
    const [loadingRides, setLoadingRides] = useState(true);

    const { data } = useQuery(GET_CONFIGURATION);
    const apiKey = data?.configuration?.googleApiKey;
    const fromLocation = useSelector(
        (state: RootState) => state.rideLocation.fromLocation
    );
    const getHours = useSelector((state: RootState) => state.rideCreation.hours)
    const toLocation = useSelector(
        (state: RootState) => state.rideLocation.toLocation
    );

    const [rideData, setRideData] = useState<{ rideTypeFares: any[] } | null>(
        null
    );
    const [selectedRide, setSelectedRide] = useState<any | null>(null);
    const { currency } = useSelector((state: RootState) => state.appConfig);
    // const [rideKm, setRideKm] = useState("");
    // const [rideDuration, setRideDuration] = useState("");

    const formatRideName = (name?: string | null): string => {
        if (!name || typeof name !== "string") {
            return ""; // fallback if name is invalid
        }
        return name.replace(/_/g, " ");
    };

    console.log("getHours", getHours);


    const hourlyRide = useSelector((state: RootState) => state.rideCreation.hourlyRide);

    console.log("Hourly ride", hourlyRide)





    useEffect(() => {
        if (apiKey && fromLocation && toLocation) {
            setLoadingRides(true)
            const durationMin = getHours * 60;
            sendFareData([fromLocation], [toLocation], apiKey, hourlyRide, durationMin)
                .then((res) => {
                    console.log("🚖 Ride fares response:", res);
                    setLoadingRides(false)
                    setRideData(res.fareData);

                    dispatch(setRideKm(String(res.distanceKm)));
                    dispatch(setRideDuration(String(res.durationMin)));



                    if (res?.fareData?.rideTypeFares?.length > 0) {
                        setSelectedRide(res.fareData.rideTypeFares[0]);
                        dispatch(setLastSelectedRide(res.fareData.rideTypeFares[0]));
                    }
                })
                .catch(console.error);
        }
    }, [apiKey, fromLocation, toLocation]);




    useEffect(() => {
        const fares = rideData?.rideTypeFares ?? [];

        if (fares.length > 0 && !selectedRide) {
            const firstRide = fares[0];
            setSelectedRide(firstRide);
            dispatch(setLastSelectedRide(firstRide));
        }
    }, [rideData, selectedRide, dispatch]);

    console.log("Selected ride is ", selectedRide)


    return (
        <>


            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingVertical: 16, paddingBottom: 600, flexGrow: 1, position: 'relative' }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
            >
                {loadingRides ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#4B5563" />
                        <CustomText className="mt-2" fontSize="sm" lightColor="#71717A">
                            Loading rides...
                        </CustomText>
                    </View>
                ) : (
                    rideData?.rideTypeFares?.map((ride, idx) => {
                        const isSelected = ride.name === selectedRide?.name;

                        return (
                            <TouchableOpacity
                                key={idx}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setSelectedRide(ride);
                                    dispatch(setLastSelectedRide(ride));
                                }}
                            >
                                {isSelected ? (
                                    <RideCard
                                        name={nameMap[ride.name] ?? ride.name}
                                        fare={ride.fare}
                                        capacity={
                                            ride.capacity ??
                                            (ride.name === "2W"
                                                ? 2
                                                : ride.name === "Courier"
                                                    ? 0
                                                    : 4)
                                        }
                                        recommendedFare={ride.recommendedFare ?? null}
                                        imageUrl={ride.imageUrl}
                                    />
                                ) : (
                                    <View className="flex-row justify-between mb-4 p-2 rounded-xl">
                                        <View className="flex-row items-center gap-2 space-x-3">
                                            <Image
                                                source={{ uri: ride.imageUrl }}
                                                className="w-14 h-10"
                                                resizeMode="contain"
                                            />
                                            <View className="ml-2">
                                                <CustomText
                                                    fontWeight="medium"
                                                    className="text-base font-semibold text-gray-800"
                                                >
                                                    {formatRideName(ride?.name)}
                                                </CustomText>

                                                <View className="flex-row gap-2 items-center">
                                                    <Feather name="user" size={16} color="#71717A" />
                                                    <CustomText lightColor="#71717A" fontSize="sm">
                                                        {ride.capacity ??
                                                            (ride.name === "2W"
                                                                ? 2
                                                                : ride.name === "Courier"
                                                                    ? 0
                                                                    : 4)}
                                                    </CustomText>
                                                </View>
                                            </View>
                                        </View>

                                        <View className="items-start">
                                            <CustomText
                                                lightColor="#18181B"
                                                darkColor="white"
                                                fontSize="sm"
                                            >
                                                {currency?.code} {ride.fare}
                                            </CustomText>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })
                )}



                <View className="absolute bg-white bottom-6 w-full space-y-3 z-50">




                    <TouchableOpacity className=" border-t-2 border-gray-200  py-3 px-5 flex-row justify-between items-center" onPress={() => setOfferModalVisible(true)}>

                        <View className='flex-row gap-2 items-center bg-red-400'>
                            <Image source={require("@/assets/images/cash.png")} className="w-10 h-10 ml-5" resizeMode='contain' />
                            <CustomText fontSize='sm'>Cash</CustomText>
                        </View>



                        <Entypo name="chevron-small-right" size={24} color="#71717A" />
                    </TouchableOpacity>

                    <View className='px-5'>
                        <TouchableOpacity className="bg-[#3853A4] rounded-full py-4 items-center" >
                            <CustomText lightColor='white' fontWeight='medium' className="text-white text-base font-semibold">Find a ride</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </>
    )
}

export default RideFare
