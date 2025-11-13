import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';

interface SubItemsBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    subItems: any[];
}

export const SubItemsBottomSheet: React.FC<SubItemsBottomSheetProps> = ({
    visible,
    onClose,
    subItems,
}) => {
    const appTheme = useThemeColor();



    return (
        <CustomBottomSheetModal
            visible={visible}
            onClose={onClose}
            headerTitle="Additional Items"
        >
            <ScrollView className="p-4">
                {subItems.map(item => (
                    <View key={item.id} className="flex-row items-center mb-3">
                        {item.image && <Image
                            source={{ uri: item.image }}
                            style={{ width: 30, height: 30, borderRadius: 4, marginRight: 12 }}
                        />}
                        <CustomText fontSize="sm" style={{ color: appTheme.text }} className="flex-1">
                            {item.title}
                        </CustomText>
                        <CustomText fontSize="sm" style={{ color: appTheme.textSecondary }}>
                            {item?.options?.length > 0 ? item?.options?.reduce((sum, option) => sum + option.price, 0) : item?.price ? item?.price : 0} €
                        </CustomText>
                    </View>
                ))}
            </ScrollView>
        </CustomBottomSheetModal>
    );
};
