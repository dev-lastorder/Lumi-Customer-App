import { View, Image, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import OrderQuantity from './order-quality';
import { useDispatch } from 'react-redux';
import { CartItem } from '@/utils/interfaces/cart';
import { openProductDetailModal } from '@/redux/slices/productModalSlice';

export default function OrderItemRow({
  item,
  isEditing,
  onTapQuantity,
  onQuantityChange,
}: {
  item: CartItem;
  isEditing: boolean;
  onTapQuantity: () => void;
  onQuantityChange: (q: string) => void;
}) {
  const dispatch = useDispatch();

  const handleCardPress = () => {
    dispatch(
      openProductDetailModal({
        product: item.product,
        initialQuantity: item.quantity,
        initialVariationId: item.variationId,
        initialAddonIds: undefined,
        actionType: 'edit',
      })
    );
  };

  return (
    <View className="flex-row items-center justify-between py-3 border-b  border-border dark:border-border ">
      <TouchableOpacity onPress={onTapQuantity}>
        <OrderQuantity quantity={item?.quantity} editing={isEditing} onChange={onQuantityChange} onCloseEditing={onTapQuantity} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCardPress} className="flex-1 flex-row justify-between items-center gap-3">
        <View className="flex-1 px-6">
          <CustomText variant="body" fontWeight="semibold" fontSize="sm" className="line-clamp-1">
            {item?.productTitle}
          </CustomText>
          <CustomText variant="body" fontWeight="normal" fontSize="sm" className="text-primary dark:text-dark-primary text-sm">
            {(item?.unitPrice * item.quantity).toFixed(2)} €
          </CustomText>
        </View>

        <Image source={{ uri: item?.imageUrl }} className="w-16 h-12 rounded-lg" resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );
}
