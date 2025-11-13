import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

interface PastReorderAddToCartButtonProps {
    onPress: () => void;
    isDisabled: boolean;
}

export const PastReorderAddToCartButton: React.FC<PastReorderAddToCartButtonProps> = ({
    onPress,
    isDisabled,
}) => {
    const appTheme = useThemeColor();

    return (
        <View className="p-4 bg-background dark:bg-dark-background border-t border-gray-200 dark:border-dark-grey/30">
            <TouchableOpacity
                className={`h-14 justify-center items-center rounded-xl ${isDisabled ? 'opacity-50' : ''}`}
                style={{ backgroundColor: appTheme.primary }}
                onPress={onPress}
                disabled={isDisabled}
            >
                <CustomText fontWeight="normal" fontSize="md" style={{ color: appTheme.buttonText }}>
                    Add to Cart
                </CustomText>
            </TouchableOpacity>
        </View>
    );
};
