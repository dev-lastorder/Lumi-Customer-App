import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomText } from '@/components';
import { selectQuantityByProduct, setQuantity, useAppSelector } from '@/redux';
import { getBaseVariationIdForItem, shadowStyle } from '@/utils';
import { Product } from '@/utils/interfaces/product-detail';
import AnimatedCornerControl from './animated-corner-control';
import { openProductDetailModal } from '@/redux/slices/productModalSlice';

// --- CONSTANTS ---
const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 2.5;

// --- PROPS INTERFACE ---
interface ProductCardProps {
  product: Product;
}

// --- LOGIC HOOK (useProductCard) ---
const useProductCard = ({ product }: ProductCardProps) => {
  const { id } = product;
  const dispatch = useDispatch();

  const defaultVariationId = getBaseVariationIdForItem(product);
  const defaultAddonIds: string[] = [];

  const quantity = useAppSelector((state) => selectQuantityByProduct(state, id, defaultVariationId, defaultAddonIds));

  const handleIncrement = () => {
    dispatch(
      setQuantity({
        product,
        variationId: defaultVariationId,
        selectedAddonIds: defaultAddonIds,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrement = () => {
    dispatch(
      setQuantity({
        product,
        variationId: defaultVariationId,
        selectedAddonIds: defaultAddonIds,
        quantity: Math.max(0, quantity - 1), // Ensures quantity never drops below zero.
      })
    );
  };

  const handleCardPress = () => {
    const isEditing = quantity > 0;
    dispatch(
      openProductDetailModal({
        product,
        actionType: isEditing ? 'edit' : 'add',
        initialQuantity: isEditing ? quantity : 1,
        initialVariationId: isEditing ? defaultVariationId : undefined,
        initialAddonIds: isEditing ? defaultAddonIds : undefined,
      })
    );
  };

  return {
    quantity,
    handleIncrement,
    handleDecrement,
    handleCardPress,
  };
};

// --- PRESENTATIONAL COMPONENT (ProductCard) ---
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, image, price, currency = 'ALL', title } = product;
  const { quantity, handleIncrement, handleDecrement, handleCardPress } = useProductCard({ product });

  return (
    <TouchableOpacity
      className="relative my-2 rounded-[10px] bg-background dark:bg-dark-icon-background"
      style={[shadowStyle.card, { width: CARD_WIDTH }]}
      onPress={handleCardPress}
      activeOpacity={0.7}
      testID={`product-card-${id}`}
      accessible
      accessibilityLabel={`${title}, ${price} ${currency}`}
      accessibilityRole="button"
    >
      <View className="h-[120px] w-full items-center justify-center overflow-hidden">
        <Image source={{ uri: image }} className="h-full w-full rounded-t-md" resizeMode="cover" testID={`product-image-${id}`} />
      </View>

      <View className="px-3 pb-2 pt-1">
        <CustomText
          variant="body"
          fontWeight="medium"
          className="mb-1 text-base text-primary dark:text-dark-primary"
          isDefaultColor={false}
          testID={`product-price-${id}`}
        >
          {price?.toLocaleString()} {currency}
        </CustomText>

        <CustomText variant="label" numberOfLines={2} ellipsizeMode="tail" testID={`product-name-${id}`}>
          {title}
        </CustomText>
      </View>

      <AnimatedCornerControl quantity={quantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />
    </TouchableOpacity>
  );
};

export default ProductCard;
