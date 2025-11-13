import { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { usePastOrderDetail } from '@/hooks/usePastOrderDetail';
import { GET_RESTAURANT_DETAILS } from '@/api/graphql/query/restaurant';
import { clearCart, setQuantity, setRestaurantId, setPastOrderAddress } from '@/redux/slices/cartSlice';
import { GET_ORDER_BY_ID } from '@/api/graphql/query/active0rders';

export const usePastReorderLogic = (orderId: string, restaurantId: string) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data,
    loading: orderLoading,
    error: orderError,
    refetch,
  } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId },
    // fetchPolicy: 'cache-and-network',
    skip: !orderId,
  });

  // useEffect(() => {
  //   console.log('orderData', JSON.stringify(data?.order?.items, null, 2));
  // }, [data]);

  let order = data?.order || {};

  const {
    data: restaurantData,
    loading: restaurantLoading,
    error: restaurantError,
  } = useQuery(GET_RESTAURANT_DETAILS, {
    variables: { id: restaurantId },
    skip: !restaurantId || !order,
  });

  // console.log('restaurantData', restaurantData);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [currentSubItems, setCurrentSubItems] = useState<any[]>([]);

  const restaurantItems = useMemo(() => {
    if (!restaurantData?.restaurant?.categories) return [];
    return restaurantData.restaurant.categories.flatMap((category: any) => category.foods || []);
  }, [restaurantData]);

  // console.log(JSON.stringify(order, null, 2), 'order items');

  useEffect(() => {
    if (order?.items && restaurantData?.restaurant) {
      const restaurantItemsMap = new Map();
      restaurantData.restaurant.categories?.forEach((category: any) => {
        category.foods?.forEach((food: any) => {
          restaurantItemsMap.set(food._id, food);
        });
      });

      const availableItems = order.items.filter((orderItem: any) => {
        const restaurantItem = restaurantItemsMap.get(orderItem._id);
        return restaurantItem?.isOutOfStock ? restaurantItem?.isOutOfStock : true;
      });
      setSelectedItems(availableItems.map((item: any) => item._id));
    }
  }, [order, restaurantData]);

  const calculateItemPrice = (item: any) => {
    let price = 0;
    if (item.variation && item.variation.price) {
      price += item.variation.price;
    }
    if (item.addons && item.addons.length > 0) {
      item.addons.forEach((addon: any) => {
        if (addon.price) {
          price += addon.price;
        }
      });
    }
    return (price * item.quantity).toFixed(2);
  };

  const handleToggleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleShowSubItems = (subItems: any[]) => {
    setCurrentSubItems(subItems);
    setIsBottomSheetVisible(true);
  };

  const handleAddToCart = () => {
    dispatch(clearCart());
    dispatch(setRestaurantId(restaurantId));
    dispatch(
      setPastOrderAddress({
        address: order.deliveryAddress.address,
        addressId: order.deliveryAddress._id,
        latitude: order.deliveryAddress.location.coordinates[1],
        longitude: order.deliveryAddress.location.coordinates[0],
        addressDetails: order.deliveryAddress.details,
      })
    );

    selectedItems.forEach((selectedItemId) => {
      const orderItem = order.items.find((item: any) => item._id === selectedItemId);
      if (orderItem) {
        const restaurantProduct = restaurantItems.find((resItem: any) => resItem._id === orderItem.food);

        if (restaurantProduct && !restaurantProduct.isOutOfStock) {
          const variation = orderItem.variation;

          // A variation is required to determine price and other details.
          if (!variation) {
            console.warn(`Skipping item "${restaurantProduct.name}" because variation details are missing.`);
            return; // continue to next item
          }

          const selectedAddonIds = (orderItem.addons?.map((addon: any) => addon._id) || []).sort();
          // const uniqueId = [restaurantProduct._id, variation._id, ...selectedAddonIds].join('_');

          // const addonPrices =
          //   orderItem.addons?.map((addon: any) => ({
          //     id: addon._id,
          //     title: addon.title,
          //     price: addon.price,
          //   })) || [];

          // const unitPrice = variation.price + addonPrices.reduce((sum, addon) => sum + addon.price, 0);

          const cartItem = {
            product: {
              ...restaurantProduct,
              id: restaurantProduct._id,
              restaurantId: restaurantId,
              restaurantName: restaurantData.restaurant.name,
              quantity: orderItem.quantity,
              variations:
                typeof orderItem?.variation === 'object'
                  ? [{ ...orderItem?.variation, id: variation?._id }]
                  : orderItem?.variation?.length > 0
                    ? orderItem?.variation.map((v: any) => ({ ...v, id: v._id }))
                    : [],
              addons: orderItem?.addons,
              price: variation?.price - variation?.discounted || 0,
            },
            // uniqueId,
            // productId: restaurantProduct._id,
            variationId: orderItem?.variation?._id,
            selectedAddonIds,

            // productTitle: restaurantProduct.name,
            // variationTitle: variation.title,
            // imageUrl: restaurantProduct.image,

            // basePrice: variation.price,
            // addons: addonPrices,
            // unitPrice,
            quantity: orderItem.quantity,
          };

          // const isAddToCartDisabled = selectedItems.length === 0;

          console.log(JSON.stringify(cartItem, null, 2));

          dispatch(setQuantity(cartItem));
        }
      }
    });

    router.navigate('/order-checkout');
  };

  const isAddToCartDisabled = selectedItems.length === 0;

  return {
    order,
    orderLoading,
    orderError,
    restaurantData,
    restaurantLoading,
    restaurantError,
    selectedItems,
    isBottomSheetVisible,
    setIsBottomSheetVisible,
    currentSubItems,
    handleToggleSelectItem,
    handleShowSubItems,
    handleAddToCart,
    isAddToCartDisabled,
    calculateItemPrice,
    restaurantItems,
  };
};
