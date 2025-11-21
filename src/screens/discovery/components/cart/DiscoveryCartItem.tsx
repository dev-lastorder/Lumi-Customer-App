import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';
import { CartItem } from '@/utils/interfaces/cart';
import React, { useCallback, useMemo } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { decreaseQuantityToZero, setCartPopupVisibility, setQuantity } from '@/redux';
import { useRouter } from 'expo-router';

interface DiscoveryCartItemProps {
  item: CartItem;
  isEditing: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const DiscoveryCartItem: React.FC<DiscoveryCartItemProps> = ({ item, isEditing, isSelected, onToggleSelect }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Memoize calculations
  const radioButtonIconName = isSelected ? 'radio-button-checked' : 'radio-button-unchecked';

  const { variation, selectedAddons, totalPrice } = useMemo(() => {
    const variation = item?.product?.variations?.find((v) => v.id === item.variationId);
    const selectedAddons = variation?.addons?.filter((addon) => item.selectedAddonIds.includes(addon.id)) || [];
    const totalPrice = (item.unitPrice * item.quantity).toFixed(2);

    return { variation, selectedAddons, totalPrice };
  }, [item]);

  const goToDetails = useCallback(() => {
    if (!item?.product?.restaurantId) {
      console.warn('Restaurant ID not found');
      return;
    }

    router.push({
      pathname: '/(food-delivery)/(discovery)/restaurant-details',
      params: { id: String(item.product.restaurantId) },
    });
  }, [router, item?.product?.restaurantId]);

  const handleRemoveFromCart = useCallback(() => {
    dispatch(
      decreaseQuantityToZero({
        uniqueId: item?.uniqueId,
      })
    );
  }, [dispatch, item]);

  const handleDotsPress = useCallback(() => {
    Alert.alert(
      item.productTitle,
      'Choose an option',
      [
        {
          text: 'Add More Items',
          onPress: goToDetails,
        },
        {
          text: 'Delete from Cart',
          onPress: handleRemoveFromCart,
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, [item.productTitle, goToDetails, handleRemoveFromCart]);

  // Validate item data
  if (!item || !item.product) {
    console.warn('Invalid cart item data:', item);
    return null;
  }

  return (
    <View className="flex items-center justify-center">
      <View className="bg-background dark:bg-dark-background border-[1.5px] border-border dark:border-dark-border/30 my-2 rounded-lg w-[90%] p-4">
        {/* Food Section */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  marginRight: 12,
                }}
                resizeMode="cover"
                onError={() => console.warn('Failed to load image:', item.imageUrl)}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  marginRight: 12,
                  backgroundColor: '#f0f0f0',
                }}
                className="items-center justify-center"
              >
                <CustomIcon
                  icon={{
                    type: 'MaterialIcons',
                    name: 'image',
                    size: 24,
                  }}
                  className="text-gray-400"
                />
              </View>
            )}

            <View className="flex-1">
              <CustomText fontWeight="bold" numberOfLines={2}>
                {item.productTitle}
              </CustomText>
              {item.variationTitle && (
                <CustomText fontSize="sm" className="text-gray-500 dark:text-gray-400">
                  {item.variationTitle}
                </CustomText>
              )}
            </View>
          </View>

          {/* Action Icons */}
          <View className="ml-2">
            {isEditing ? (
              <TouchableOpacity onPress={onToggleSelect} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <CustomIcon
                  icon={{
                    type: 'MaterialIcons',
                    name: radioButtonIconName,
                    size: adjust(24),
                  }}
                  className="text-primary dark:text-dark-primary"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleDotsPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <CustomIcon
                  icon={{
                    type: 'MaterialCommunityIcons',
                    name: 'dots-horizontal-circle-outline',
                    size: adjust(24),
                  }}
                  className="text-primary dark:text-dark-primary"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Addons Section */}
        {(selectedAddons.length > 0 || item.selectedAddonIds.length > 0) && (
          <View className="mt-3">
            {selectedAddons.length > 0 ? (
              selectedAddons.map((addon) => (
                <CustomText key={addon.id} fontSize="sm" className="text-gray-600 dark:text-gray-300">
                  + {addon.title}
                </CustomText>
              ))
            ) : (
              <CustomText fontSize="sm" className="text-gray-500 italic">
                No addons selected
              </CustomText>
            )}
          </View>
        )}

        {/* Price and Quantity Section */}
        <View className="mt-4 flex-row justify-between items-center">
          <CustomText fontWeight="semibold">
            {item.currency}
            {totalPrice}
          </CustomText>
          <CustomText fontSize="sm" className="text-gray-600 dark:text-gray-400">
            Qty: {item.quantity}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default React.memo(DiscoveryCartItem);
