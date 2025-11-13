import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import OrderHistoryCard from './order-history.list.card';

export type OrdersByDate = {
  [date: string]: any[];
};

export default function OrderHistoryList({ orders }: { orders: OrdersByDate }) {
    const appTheme = useThemeColor();
    return (
        <View className="px-4 py-3">
            {Object.entries(orders).map(([date, date_orders]) => (
                <View key={date}>
                    <CustomText fontWeight="semibold" fontSize="sm" className="mb-2" style={{ color: appTheme.textSecondary }}>
                        {date}
                    </CustomText>
                    {date_orders.map((order: any) => (
                        <OrderHistoryCard key={order._id} order={order} />
                    ))}
                </View>
            ))}
        </View>
    );
}