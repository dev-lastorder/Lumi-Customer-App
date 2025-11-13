import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';
import { Ionicons } from '@expo/vector-icons';

export default function PastOrderDelivery({ address, note, phone, appTheme }: { address: string, note: string, phone: string, appTheme: any }) {
    return (
        <>
            <CustomText fontWeight="medium" fontSize="md" className="mb-2" style={{ color: appTheme.text }}>
                Delivery
            </CustomText>
            <View className="flex-row flex-1 items-start mb-2 gap-4">
                <Ionicons name="location-outline" size={18} color={appTheme.text} style={{ marginTop: 2 }} />
                <CustomText fontSize="sm" style={{ color: appTheme.text }}>
                    {address}
                </CustomText>
            </View>
            {note && <View className="flex-row flex-1 items-start me-4 gap-4">
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={appTheme.text} style={{ marginTop: 2 }} />
                <CustomText fontSize="xs" className="text-wrap" style={{ color: appTheme.textSecondary }}>
                    {note}
                </CustomText>
            </View>}

        </>
    );
}