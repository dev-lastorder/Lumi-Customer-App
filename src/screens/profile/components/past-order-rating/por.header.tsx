import React from 'react';
import { View, Image } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

interface PORHeaderProps {
    restaurant: {
        name: string;
        image: string;
        date: string;
    };
}

const PORHeader: React.FC<PORHeaderProps> = ({ restaurant }) => {
    const appTheme = useThemeColor();

    return (
        <View className="items-center mt-6 mb-2">
            <Image
                source={{ uri: restaurant.image }}
                style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 8 }}
            />
            <CustomText fontWeight="semibold" fontSize="md" className="mb-1" style={{ color: appTheme.text }}>
                {restaurant.name} · {restaurant.date}
            </CustomText>
        </View>
    );
};

export default PORHeader;
