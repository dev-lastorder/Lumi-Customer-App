import { View, Text, Modal, Pressable, Image } from 'react-native'
import React from 'react'
import { CustomIcon, CustomText } from '@/components';
import { Coupon } from './interfaces';
import formatDate from '@/utils/helpers/formatDate';

interface CouponDetailsModalProps {
    showDetailsModal: boolean;
    closeModal: () => void;
    coupon: Coupon | null;
}

const CouponDetailModal = ({ showDetailsModal, closeModal, coupon }: CouponDetailsModalProps) => {


    return (
        <Modal
            animationType="slide"
            transparent
            visible={showDetailsModal}
        >
            <Pressable
                className="flex-1 justify-end bg-black/50"
                onPress={closeModal}
            >
                <Pressable
                    className="relative bg-bgLight dark:bg-dark-bgLight rounded-t-2xl"
                    onPress={e => e.stopPropagation()}
                >
                    <View className='w-full bg-primary/20 flex items-center justify-center relative h-[200px] rounded-t-2xl'>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/512/7098/7098666.png'
                            }}
                            style={{ width: 90, height: 90 }}
                        />
                        <Pressable
                            className="bg-gray-100 dark:bg-gray-500/30 w-10 h-10 flex items-center justify-center rounded-full absolute top-6 right-5"
                            onPress={closeModal}
                        >
                            <CustomIcon icon={{ size: 28, type: 'Entypo', name: 'cross' }} />
                        </Pressable>
                    </View>
                    <View className='p-4 pb-10'>
                        <CustomText
                            variant='heading2'
                            fontSize='xl'
                            fontWeight='bold'
                        >
                            {`${coupon?.title}`}
                        </CustomText>
                    </View>

                    <View className="px-4 pb-12 flex-col gap-4">
                        <View className="bg-white dark:bg-dark-bgLight rounded-xl p-4 shadow-sm border border-border dark:border-dark-border/30 flex-row items-center justify-between py-6">
                            <CustomText
                                variant='caption'
                                fontSize='xs'
                                fontWeight='medium'
                            >
                                Discount
                            </CustomText>
                            <CustomText
                                variant='defaults'
                                fontSize='sm'
                            >
                                {coupon?.discount}%
                            </CustomText>
                        </View>

                        <View className="bg-white dark:bg-dark-bgLight rounded-xl p-4 shadow-sm border border-border dark:border-dark-border/30 flex-row items-center justify-between py-6">
                            <CustomText
                                variant='caption'
                                fontSize='xs'
                                fontWeight='medium'
                            >
                                Expires on
                            </CustomText>
                            <CustomText
                                variant='defaults'
                                fontSize='sm'
                            >
                                {coupon?.endDate ? formatDate(coupon?.endDate) : 'No expiry'}
                            </CustomText>
                        </View>


                        <View className="bg-white dark:bg-dark-bgLight rounded-xl p-4 shadow-sm border border-border dark:border-dark-border/30 flex-row items-center justify-between py-6">
                            <CustomText
                                variant='caption'
                                fontSize='xs'
                                fontWeight='medium'
                            >
                                Status
                            </CustomText>
                            <View
                                className={`px-3 py-1 rounded-full
                                    ${coupon?.enabled
                                        ? 'bg-green-100 dark:bg-green-800/30'
                                        : 'bg-red-100 dark:bg-red-800/30'}
                                `}
                            >
                                <Text
                                    className={`text-sm font-medium
                                        ${coupon?.enabled
                                            ? 'text-green-700 dark:text-green-300'
                                            : 'text-red-700 dark:text-red-300'}
                                    `}
                                >
                                    {coupon?.enabled ? 'Active' : 'InActive'}
                                </Text>
                            </View>
                        </View>
                    </View>


                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default CouponDetailModal