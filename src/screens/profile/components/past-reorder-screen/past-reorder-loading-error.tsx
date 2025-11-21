import React from 'react';
import { View } from 'react-native';
import { CustomText, LoadingPlaceholder } from '@/components';

interface PastReorderLoadingErrorProps {
    isLoading: boolean;
    message: string;
}

export const PastReorderLoadingError: React.FC<PastReorderLoadingErrorProps> = ({
    isLoading,
    message,
}) => {
    return (
        <View className="flex-1 justify-center items-center">
            {isLoading ? (
                <LoadingPlaceholder size="large" />
            ) : (
                <CustomText>{message}</CustomText>
            )}
        </View>
    );
};
