import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';

export default function OrderHistoryHeader() {
    return (
        <View className="flex-row items-start px-4 py-3 bg-background dark:bg-dark-background ">
            <CustomText
                fontWeight="semibold"
                fontSize="xl"
                className="flex-1 "
                style={{ letterSpacing: 0.1 }}
            >
                Past Orders
            </CustomText>
        </View>
    );
}