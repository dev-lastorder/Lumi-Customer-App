import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LocationSearchModal from '../component/LocationSearchModel'
import RecentSearches from '../component/RecentSearches'
import { CustomText } from '@/components'
import RideSelection from '../component/RideSelection'

import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks'
import HomeScreenCards from '@/screens/HomeScreen/component/card'
import { useDispatch } from 'react-redux'
import { setFromSliceCoords, setFromSliceLocation, setToSliceCoords, setToSliceLocation } from '@/redux/slices/RideSlices/rideLocationSlice'
import { resetFamilyRide, resetHourlyRide, resetScheduleRide, setFamilyRide, setHourlyRide, setScheduleRide } from '@/redux/slices/RideSlices/rideCreationSlice'


interface Props {
    setRideConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    setFromLocation: React.Dispatch<React.SetStateAction<string>>;
    setToLocation: React.Dispatch<React.SetStateAction<string>>;

    fromLocation: string;

    toLocation: string;


}

const RiderRequest: React.FC<Props> = ({
    setFromLocation,
    setRideConfirmation,
    setToLocation,


    fromLocation,
    toLocation,




}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { bgLight, text } = useThemeColor();


    const [fromCoords, setFromCoords] = useState<{ lat: string; lng: string } | null>(null);
    const [toCoords, setToCoords] = useState<{ lat: string; lng: string } | null>(null);
    
    const dispatch = useDispatch();






    return (
        <>
            <TouchableOpacity className='bg-white' style={styles.searchBar} onPress={() => {
                dispatch(resetScheduleRide());
                dispatch(resetHourlyRide());
                dispatch(resetFamilyRide())
                setModalVisible(true)
            }}>
                <FontAwesome5 name="location-arrow" size={22} color="black" />

                <CustomText
                    className="flex-1 text-base pl-1"
                    style={{ color: text }}
                    fontSize='sm'
                >
                    Where to?
                </CustomText>

                <TouchableOpacity className='bg-[#3853A4] p-4 rounded-full flex-row items-center gap-4' onPress={() => {
                    dispatch(setScheduleRide(true));
                    dispatch(resetHourlyRide());
                    setModalVisible(true);
                }}>
                    <MaterialCommunityIcons name="clock-time-five" size={24} color="white" />
                    <CustomText lightColor='white'>Schedule</CustomText>
                </TouchableOpacity>
            </TouchableOpacity>


            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingVertical: 16, paddingBottom: 600, flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row gap-4 px-4">

                    <TouchableOpacity onPress={() => {
                        dispatch(resetScheduleRide());
                        dispatch(resetHourlyRide());
                        dispatch(resetFamilyRide())
                        setModalVisible(true)
                    }} className="bg-[#E9E6F7] rounded-3xl shadow items-center  justify-center p-4 h-[220px]" style={{ width: '40%' }}>
                        <Image
                            source={require("@/assets/images/bookRide.png")}
                            className="w-32 h-20"
                            resizeMode="contain"
                        />
                        <CustomText fontWeight='semibold' className="mt-6 self-center text-center">Book a Ride</CustomText>
                    </TouchableOpacity>

                    <View className="flex-1 h-[220px]" style={{ width: '60%' }}>
                        <Pressable className="w-full h-2/5 flex-row bg-[#E9E6F7] rounded-3xl shadow items-center px-2 mb-4" onPress={() => {
                            dispatch(setHourlyRide(true));
                            dispatch(resetFamilyRide())
                            dispatch(resetScheduleRide());
                            setModalVisible(true);
                        }}>
                            <Image
                                source={require("@/assets/images/hourRide.png")}
                                className="w-20 h-20"
                                resizeMode="contain"
                            />
                            <CustomText fontWeight='semibold' fontSize='sm' className="ml-1">Hourly Ride</CustomText>
                        </Pressable>

                        <View className="flex-row flex-1 gap-2">
                            {/* <Pressable className="flex-1 bg-[#E9E6F7] rounded-3xl shadow items-center justify-center">
                                <Image
                                    source={require("@/assets/images/courier.png")}
                                    className="w-20 h-20"
                                    resizeMode="contain"
                                />
                                <CustomText fontWeight='semibold' fontSize='sm' className="mt-2">Courier</CustomText>
                            </Pressable> */}

                            <Pressable className="flex-1 bg-[#E9E6F7] rounded-3xl shadow items-center justify-center" onPress={() => {
                                dispatch(setFamilyRide(true));
                                dispatch(resetScheduleRide())
                                dispatch(resetHourlyRide());
                                setModalVisible(true);

                            }}>
                                <Image
                                    source={require("@/assets/images/familyRide.png")}
                                    className="w-20 h-20"
                                    resizeMode="contain"
                                />
                                <CustomText fontWeight='semibold' fontSize='sm' className="mt-2">family</CustomText>
                            </Pressable>
                        </View>
                    </View>


                </View>
                <View className='bg-[#E9E6F7] rounded-3xl shadow mt-5 p-4'>
                    <View className='flex-row items-center gap-1 px-3'>
                        <CustomText fontSize='sm' fontWeight='light' >More with</CustomText>
                        <CustomText fontSize='sm' fontWeight='bold'>Lumi</CustomText>
                    </View>
                    <HomeScreenCards filterTitles={["LUMI Hospitality", "LUMI Food", "LUMI Hotel", "LUMI Ticket"]} noBackground />

                </View>
            </ScrollView>






            {/* <RideSelection />

            <RecentSearches /> */}

            <LocationSearchModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                fromLocation={fromLocation}
                toLocation={toLocation}
                fromCoords={fromCoords}
                toCoords={toCoords}
                setFromLocation={setFromLocation}
                setToLocation={setToLocation}
                setFromCoords={setFromCoords}
                setToCoords={setToCoords}
                setRideConfirmation={setRideConfirmation}
            />
        </>
    )
}

export default RiderRequest

const styles = StyleSheet.create({

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#E4E4E7",
        paddingHorizontal: 5,
        paddingLeft: 15,
        paddingVertical: 4,
        marginTop: 10,
        gap: 10,
    },
})