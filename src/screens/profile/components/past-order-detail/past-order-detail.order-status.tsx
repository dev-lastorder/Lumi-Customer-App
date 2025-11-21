import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import formatDate from '@/utils/helpers/formatDate';

export default function PastOrderStatus({ status, statusTime, appTheme }: { status: string, statusTime: string, appTheme: any }) {
    return (
        <>
            <CustomText fontWeight="medium" fontSize="md" className="mb-2 mt-5" style={{ color: appTheme.text }}>
                Order status
            </CustomText>
            <View className="flex-row items-center gap-4">
                <MaterialCommunityIcons name="checkbox-marked" size={18} color={appTheme.text} />
                <CustomText fontSize="xs" style={{ color: appTheme.text }}>
                    {status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : ''}, {formatDate(statusTime)}
                </CustomText>
            </View>
        </>
    );
}