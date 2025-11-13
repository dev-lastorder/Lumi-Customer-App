import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { useRouter } from 'expo-router';
import formatDate from '@/utils/helpers/formatDate';



function getOrderDisplayDate(order: any) {
    if (order?.status?.toLowerCase() === 'pending') return order?.orderDate;
    if (order?.status?.toLowerCase() === 'accepted') return order?.acceptedAt;
    if (order?.status?.toLowerCase() === 'assigned') return order?.assignedAt;
    if (order?.status?.toLowerCase() === 'cancelled') return order?.cancelledAt;
    if (order?.status?.toLowerCase() === 'completed') return order?.deliveredAt;
    return order?.orderDate;
}

export default function OrderHistoryCard({ order }: { order: any }) {

    const appTheme = useThemeColor();
    const router = useRouter();
    const displayDate = getOrderDisplayDate(order);

    

    return (
        <View key={order._id} className="flex-row items-center mb-4">
            <TouchableOpacity className="flex-row items-center" onPress={() => router.push({ pathname: "/past-order-detail", params: { id: order._id } })}>
                <Image
                    source={{ uri: order?.restaurant?.image }}
                    style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12 }}
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <CustomText fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
                        {order?.restaurant?.name} · {order?.orderAmount}
                    </CustomText>
                    <CustomText fontSize="xs" style={{ color: appTheme.textSecondary }}>
                        {order?.items[0]?.title}
                    </CustomText>
                    <CustomText fontSize="xs" style={{ color: appTheme.textSecondary }}>
                        {order?.orderStatus?.toString()} {formatDate(displayDate)}
                    </CustomText>
                </View>
            </TouchableOpacity>
        </View>
    );
}