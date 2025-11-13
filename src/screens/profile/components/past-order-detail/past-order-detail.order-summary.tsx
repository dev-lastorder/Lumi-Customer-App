import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import formatDate from '@/utils/helpers/formatDate';
import { useRouter } from 'expo-router';


export default function PastOrderSummary({ order, appTheme }: { order: any, appTheme: any }) {
    const { currencySymbol } = useSelector((state: RootState) => state.configuration?.configuration)
    const router = useRouter();


    return (
        <View className="mt-5">
            <View className="flex-row justify-between mb-3 py-3 border-b border-gray-200 dark:border-dark-grey/30">
                <CustomText fontSize="sm" style={{ color: appTheme.text }}>
                    Tip to the courier
                </CustomText>
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    {order.tip} {currencySymbol}
                </CustomText>
            </View>
            <View className="flex-row justify-between mb-3 py-3 border-b border-gray-200 dark:border-dark-grey/30">
                <CustomText fontSize="sm" style={{ color: appTheme.text }}>
                    Delivery fee
                </CustomText>
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    {order.deliveryCharges} {currencySymbol}
                </CustomText>
            </View>
            <View className="flex-row justify-between mb-3 py-3 border-b border-gray-200 dark:border-dark-grey/30">
                <CustomText fontSize="sm" style={{ color: appTheme.text }}>
                    Taxation amount
                </CustomText>
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    {order.taxationAmount} {currencySymbol}
                </CustomText>
            </View>
            <View className="flex-row justify-between mb-5 py-3 border-b border-gray-200 dark:border-dark-grey/30">
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    Total in € (incl. taxes)
                </CustomText>
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    {order.price} {currencySymbol}
                </CustomText>
            </View>

            <CustomText fontWeight="semibold" fontSize="md" className="mb-3 mt-5" style={{ color: appTheme.text }}>
                Payment
            </CustomText>
            <View className="flex-row justify-between mb-1">
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    {order.paymentMethod}
                </CustomText>
                <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                    {order.price} {currencySymbol}
                </CustomText>
            </View>
            <CustomText fontSize="xs" className="mb-4" style={{ color: appTheme.textSecondary }}>
                {formatDate(order.paymentTime)}
            </CustomText>

            <TouchableOpacity className="rounded-lg my-5" style={{ backgroundColor: appTheme.primary + '11' }}>
                <CustomText fontWeight="medium" fontSize="sm" className="text-center py-3" style={{ color: appTheme.primary }}>
                    Send receipt to email
                </CustomText>
            </TouchableOpacity>

            <CustomText fontWeight="semibold" fontSize="md" className="mt-5 mb-2" style={{ color: appTheme.text }}>
                Venue info
            </CustomText>
            <CustomText fontSize="sm" className="mb-4" style={{ color: appTheme.text }}>
                {order.restaurant}
                {'\n'}
                {order.venueAddress}
                {'\n'}
                {order.venuePhone}
            </CustomText>

            <CustomText fontWeight="semibold" fontSize="md" className="mb-2 mt-5" style={{ color: appTheme.text }}>
                Order info
            </CustomText>
            <CustomText fontSize="sm" className="mb-4" style={{ color: appTheme.text }}>
                Your order number: {order.orderNumber}
                {'\n'}Order ID: {order.orderId}
                {'\n'}Timestamp: {formatDate(order?.deliveredAt)}
                {'\n'}Service provider: {order.serviceProvider}
            </CustomText>

            <TouchableOpacity onPress={() => router.push('/(profile)/help')} className="rounded-lg mt-5" style={{ backgroundColor: appTheme.primary + '11' }}>
                <CustomText fontWeight="medium" fontSize="sm" className="text-center py-3" style={{ color: appTheme.primary }}>
                    Contact Enatega support
                </CustomText>
            </TouchableOpacity>
        </View>
    );
}