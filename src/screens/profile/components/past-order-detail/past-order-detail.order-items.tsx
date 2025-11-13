import React from 'react';
import { View, Image } from 'react-native';
import { CustomText } from '@/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { PODOrderItem } from '@/utils/interfaces/past-order-detail.interface';

export default function PastOrderItems({ items, appTheme }: { items: any[], appTheme: any }) {
    const { currencySymbol } = useSelector((state: RootState) => state.configuration?.configuration)

    return (
        <>
            <CustomText fontWeight="semibold" fontSize="md" className="mb-4 mt-5" style={{ color: appTheme.text }}>
                Items you ordered
            </CustomText>
            {items.map((item, idx) => (
                <View key={idx} className="flex-row items-center mb-4">
                    <Image
                        source={item.image}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 8,
                            backgroundColor: appTheme.card,
                            marginRight: 12,
                            overflow: 'hidden',
                        }}
                        resizeMode="cover"
                    />
                    <CustomText fontWeight="normal" fontSize="sm" style={{ color: appTheme.text }}>
                        {item.name}
                    </CustomText>
                    <CustomText fontWeight="medium" fontSize="sm" className="ml-auto" style={{ color: appTheme.text }}>
                        {item.price} {currencySymbol}
                    </CustomText>
                </View>
            ))}
        </>
    );
}
