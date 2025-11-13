import { GET_RESTAURANT_COUPONS } from '@/api';
import { CustomIcon, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { useQuery } from '@apollo/client';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, ScrollView, Text , Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import CouponDetailModal from './CouponDetailModal';
import { Coupon } from './interfaces';


interface CouponListProps {
    restaurantId : string | undefined;
}



const CouponsList = ( { restaurantId } : CouponListProps ) => {
    const { primary } = useThemeColor();

    const [showDetailsModal , setShowDetailsModal] = useState(false);
    const [selectedCoupon , setSelectedCoupon] = useState<Coupon | null>(null);
    const [coupons , setCoupons] = useState<Coupon[] | []>([]);

    const { loading , error } = useQuery(GET_RESTAURANT_COUPONS , {
        variables : {
            restaurantId 
        } , 
        onCompleted: ({ restaurantCoupons }) => {
            setCoupons(restaurantCoupons)
        },
        skip: !restaurantId
    });


    const handleDetailsClick = (coupon : Coupon) => {
        setSelectedCoupon(coupon);
        setShowDetailsModal(true)
    }

    const closeModal = () => {
        setShowDetailsModal(false)
    }


    return (
        <>
            {
                loading 
                ?
                    <View className="w-full flex-1 justify-center items-center">
                        <ActivityIndicator 
                        size={'small'} 
                        color={primary} 
                        />
                    </View>
                :
                error 
                ?
                    <View className="w-full flex-1 justify-center items-center">
                        <CustomText variant='caption' lightColor='red' darkColor='red'>
                            {error?.message || 'Somehting went wrong in coupons.'}
                        </CustomText>
                    </View>
                :
                coupons?.length > 0
                ?
                    <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    className="px-4 pt-4 pb-5"
                    >
                        {
                            coupons.map(coupon => (
                                <View key={coupon._id} className="relative mr-4">
                                    <View className="absolute -left-3 top-[47%] -translate-y-1/2 w-6 h-6 bg-white dark:bg-black rounded-full z-10" />
        
                                    <View
                                        className='bg-primary/20 rounded-2xl px-6 py-3 shadow-md flex-row items-center gap-4 min-h-[80px] w-[300px]'
                                    >
                                        <View className='flex-[0.25] items-center justify-center'>
                                            <Image 
                                            source={{ 
                                                // uri : 'https://cdn-icons-png.flaticon.com/512/10302/10302492.png'
                                                // uri: 'https://cdn-icons-png.flaticon.com/512/4942/4942355.png'
                                                uri: 'https://cdn-icons-png.flaticon.com/512/7098/7098666.png'
                                            }}  
                                            style={{ width : 52 , height : 52 }}
                                            />
        
                                        </View>
                                        <View className="flex-[0.75]">
                                            <CustomText
                                            variant='defaults'
                                            fontSize='sm'
                                            fontWeight='medium'
                                            className='text-text dark:text-dark-text font-medium text-base'>
                                                {`${coupon.discount}% ${coupon.title.length > 25 ? coupon.title.slice(0,25) + '...' : coupon.title}`}
                                            </CustomText>
                                            <TouchableOpacity 
                                            className="flex-row items-center gap-1 mt-2"
                                            onPress={() => handleDetailsClick(coupon)}
                                            >
                                                <CustomText
                                                variant='defaults'
                                                fontSize='xs'
                                                fontWeight='medium'
                                                darkColor={primary}
                                                lightColor='#000'
                                                >
                                                    Show Details
                                                </CustomText>
                                                <View className='w-4 h-4 items-center justify-center bg-primary rounded-full'>
                                                    <CustomIcon
                                                    icon={{ 
                                                        name : 'arrowright' , 
                                                        type : 'AntDesign' , 
                                                        color : '#000',
                                                        size: 10
                                                    }}
                                                
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
        
        
                                    <View className="absolute -right-3 top-[47%] -translate-y-1/2 w-6 h-6 bg-white dark:bg-black rounded-full z-10" />
                                </View>
                            ))
                        }
                        
                    </ScrollView>
                :
                    ''
            }

            <CouponDetailModal 
            coupon={selectedCoupon}
            closeModal={closeModal}
            showDetailsModal={showDetailsModal}
            
            />
        </>
    );
};

export default CouponsList;
