import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { useRouter } from 'expo-router';

export default function OrderHistoryNoData({ onBrowse }: { onBrowse: () => void }) {
    const appTheme = useThemeColor();
    const router = useRouter();
    return (
        <View className="flex-1 items-center justify-center px-6 py-10">
            <Image
                source={require('@/assets/images/no-coupons-found.png')}
                style={{ width: 220, height: 180 }}
                resizeMode="contain"
            />
            <CustomText
                fontWeight="bold"
                fontSize="xl"
                className="mt-4 mb-2 text-center"
                style={{ color: appTheme.text }}
            >
                No orders
            </CustomText>
            <CustomText
                fontSize="sm"
                className="mb-6 text-center"
                style={{ color: appTheme.textSecondary }}
            >
                You haven't made any orders yet.
            </CustomText>
            <TouchableOpacity
                className="rounded-lg"
                style={{
                    backgroundColor: appTheme.primary + '11',
                }}
                onPress={() => router.navigate("/discovery")}
            >
                <CustomText
                    fontWeight="semibold"
                    fontSize="sm"
                    className="px-6 py-3 text-center"
                    style={{
                        color: appTheme.primary,
                    }}
                >
                    Browse restaurants and stores
                </CustomText>
            </TouchableOpacity>
        </View>
    );
}