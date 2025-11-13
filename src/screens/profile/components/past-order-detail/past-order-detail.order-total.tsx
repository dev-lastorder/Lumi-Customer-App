import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

export default function PastOrderTotal({ price, appTheme }: { price: string, appTheme: any }) {
    const { currencySymbol } = useSelector((state: RootState) => state.configuration?.configuration)
    return (
        <View className="mb-5 mt-5">
            <CustomText fontWeight="medium" fontSize="md" className="mb-2" style={{ color: appTheme.text }}>
                Total
            </CustomText>
            <View className="flex-row items-center mb-4 gap-4">
                <Ionicons name="bag-outline" size={18} color={appTheme.text} />
                <CustomText fontSize="sm" fontWeight="medium" style={{ color: appTheme.text }}>
                    {price} {currencySymbol}
                </CustomText>
            </View>
        </View>
    );
}