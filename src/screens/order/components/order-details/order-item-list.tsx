// src/components/order-details/OrderItemList.tsx

import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import OrderItemRow from './order-item-row';
import { CustomText } from '@/components';
import { Product } from '@/utils/interfaces/product-detail';
import { decreaseQuantity, useAppSelector , increaseQuantity} from '@/redux';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';



export default function OrderItemList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  const items = useAppSelector(state => state.cart.items)


  const onQuantityChange = (uniqueId : string , action : string) => {
    if(action === 'dec') {
      dispatch(decreaseQuantity({ uniqueId }))
    }else if(action === 'inc') {
      dispatch(increaseQuantity({ uniqueId }))
    }
  }
  

  return (
    <View className="mt-4">
      {/* Header Row */}
      <View className="flex-row justify-between items-center mb-2">
        <CustomText variant="heading3" fontWeight="semibold" fontSize="md">
          Order Items
        </CustomText>

        <TouchableOpacity onPress={() => router.back()}>
          <CustomText variant="label" fontSize="xs" lightColor="#AAC810" darkColor="#AAC810">
            + Add more
          </CustomText>
        </TouchableOpacity>

        
      </View>

      {/* Each item row */}
      {Object.values(items).map((item) => (
        <OrderItemRow
          key={item.uniqueId}
          item={item}
          isEditing={editingId === item.uniqueId}
          onTapQuantity={() => setEditingId((prev) => (prev === item.uniqueId ? null : item.uniqueId))}
          onQuantityChange={(action : string) => onQuantityChange(item.uniqueId, action)}
          // onPress={() => onItemPress(item)}
        />
      ))}


    </View>
  );
}
