import React from 'react';
import { ScrollView, View } from 'react-native';
import { ReorderItemCard } from '@/components/features/reorder-item-card';

interface PastReorderItemListProps {
    orderItems: any[];
    restaurantData: any;
    selectedItems: string[];
    onToggleSelect: (itemId: string) => void;
    onShowSubItems: (subItems: any[]) => void;
    calculateItemPrice: (item: any) => string;
}

export const PastReorderItemList: React.FC<PastReorderItemListProps> = ({
    orderItems,
    restaurantData,
    selectedItems,
    onToggleSelect,
    onShowSubItems,
    calculateItemPrice,
}) => {
    return (
        <View className="mb-20 px-4">
            {orderItems.map((orderItem: any) => {
                const restaurantItemsMap = new Map();
                restaurantData?.restaurant.categories?.forEach((category: any) => {
                    category.foods?.forEach((food: any) => {
                        restaurantItemsMap.set(food._id, food);
                    });
                });

                const restaurantItem = restaurantItemsMap.get(orderItem.food);

                const isOutOfStock = restaurantItem ? restaurantItem?.isOutOfStock : true;

                return (
                    <ReorderItemCard
                        key={orderItem._id}
                        item={{
                            id: orderItem._id,
                            image: orderItem.image, // Assuming orderItem has image now
                            title: orderItem.title,
                            price: calculateItemPrice(orderItem),
                            subItems: orderItem.addons || [],
                        }}
                        isSelected={selectedItems.includes(orderItem._id)}
                        onToggleSelect={onToggleSelect}
                        onShowSubItems={onShowSubItems}
                        isOutOfStock={isOutOfStock}
                    />
                );
            })}
        </View>
    );
};
