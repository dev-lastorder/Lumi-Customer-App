import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

interface PastReorderHeaderProps {
    message: string;
}

export const PastReorderHeader: React.FC<PastReorderHeaderProps> = ({ message }) => {
    const appTheme = useThemeColor();
    return (
        <View className="p-4 pt-0">
            <CustomText fontSize="md" className="mb-4" style={{ color: appTheme.textSecondary }}>
                {message}
            </CustomText>
        </View>
    );
};
