import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';

interface ReorderItemCardProps {
    item: {
        id: string;
        image: string;
        title: string;
        price: string;
        subItems: any[];
    };
    isSelected: boolean;
    onToggleSelect: (itemId: string) => void;
    onShowSubItems: (subItems: any[]) => void;
    isOutOfStock: boolean;
}

export const ReorderItemCard: React.FC<ReorderItemCardProps> = ({
    item,
    isSelected,
    onToggleSelect,
    onShowSubItems,
    isOutOfStock,
}) => {
    const appTheme = useThemeColor();

    return (
        <View
            className="flex-row items-center p-3 mb-3 rounded-lg"
            style={{
                borderColor: appTheme.border,
                borderWidth: 1,
                backgroundColor: appTheme.background,
                opacity: isOutOfStock ? 0.5 : 1, // Reduce opacity if out of stock
            }}
        >
            <Image
                source={{ uri: item.image }}
                style={{ width: 48, height: 64, borderRadius: 8, marginRight: 12 }}
            />
            <View className="flex-1 justify-center">
                <CustomText fontWeight="semibold" fontSize="md" style={{ color: appTheme.text }}>
                    {item.title}
                </CustomText>
                {item.subItems.length > 0 && (
                    <TouchableOpacity
                        className="flex-row items-center mt-1"
                        onPress={() => onShowSubItems(item.subItems)}
                        disabled={isOutOfStock} // Disable if out of stock
                    >
                        <CustomText fontSize="sm" style={{ color: appTheme.primary }}>
                            {item.subItems.length} additional items
                        </CustomText>
                        <Ionicons
                            name="chevron-down"
                            size={16}
                            color={appTheme.primary}
                            style={{ marginLeft: 4 }}
                        />
                    </TouchableOpacity>
                )}
                <CustomText fontSize="sm" style={{ color: appTheme.textSecondary }} className="mt-1">
                    {item.price} €
                </CustomText>
                {isOutOfStock && (
                    <CustomText fontSize="sm" fontWeight="bold" className="text-red-500 mt-1">
                        Out of Stock
                    </CustomText>
                )}
            </View>
            <TouchableOpacity onPress={() => onToggleSelect(item.id)} className="ml-4" disabled={isOutOfStock}> {/* Disable checkbox if out of stock */}
                <View
                    className={`w-6 h-6 rounded-md border-2 justify-center items-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-400'}`}
                    style={{ borderColor: isSelected ? appTheme.primary : appTheme.border }}
                >
                    {isSelected && (
                        <Ionicons name="checkmark" size={16} color={appTheme.buttonText} />
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};
