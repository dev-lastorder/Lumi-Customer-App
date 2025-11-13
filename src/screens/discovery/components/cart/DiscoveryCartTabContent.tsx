import { CustomText, LoadingPlaceholder } from '@/components';
import { useThemeColor } from '@/hooks';
import { useUserOrderHistory } from '@/hooks/useUserOrderHistory';
import { clearCart, decreaseQuantityToZero, setCartPopupVisibility, setQuantity, useAppDispatch, useAppSelector } from '@/redux';
import EmptyCart from '@/screens/order/components/order-details/EmptyCart';
import { OrderHistoryList, OrderHistoryNoData } from '@/screens/profile/components/order-history';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';
import { groupOrdersByDate } from '@/utils/helpers/groupOrdersByDate';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import DiscoveryCartItem from './DiscoveryCartItem';
import CartPopUp from '@/components/common/cartPopUp';
import { Dispatch, SetStateAction, useState, useCallback, useMemo, useEffect } from 'react';

interface DiscoveryCartTabContentProps {
  activeTab: string;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
}

const DiscoveryCartTabContent = ({ activeTab, isEditing, setIsEditing, selectedItems, setSelectedItems }: DiscoveryCartTabContentProps) => {
  const { orders, loading, error } = useUserOrderHistory();
  const appTheme = useThemeColor();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const cartItems = useAppSelector((state) => state.cart.items);

  const dispatch = useAppDispatch();

  // Add state to handle UI transitions smoothly
  const [isDeleting, setIsDeleting] = useState(false);

  // Memoize expensive calculations
  const groupedOrders = useMemo(() => groupOrdersByDate(orders), [orders]);
  const cartItemsArray = useMemo(() => Object.values(cartItems), [cartItems]);
  const hasCartItems = totalQuantity > 0;

  useEffect(() => {
    if (hasCartItems) {
      dispatch(setCartPopupVisibility(true));
    } else {
      dispatch(setCartPopupVisibility(false));
    }
  }, [hasCartItems, cartItems]);

  // Clean up selected items when they no longer exist in cart
  useEffect(() => {
    const currentItemIds = cartItemsArray.map((item) => item.uniqueId);
    const validSelectedItems = selectedItems.filter((id) => currentItemIds.includes(id));

    if (validSelectedItems.length !== selectedItems.length) {
      setSelectedItems(validSelectedItems);
    }
  }, [cartItemsArray, selectedItems, setSelectedItems]);

  const toggleSelectItem = useCallback(
    (uniqueId: string) => {
      setSelectedItems((prev) => (prev.includes(uniqueId) ? prev.filter((id) => id !== uniqueId) : [...prev, uniqueId]));
    },
    [setSelectedItems]
  );

  const handleDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;

    setIsDeleting(true);

    try {
      if (selectedItems.length === Object.keys(cartItems).length) {
        // Clear entire cart
        dispatch(clearCart());
      } else {
        // Remove selected items
        selectedItems.forEach((uniqueId) => {
          const item = cartItems[uniqueId];
          if (item) {
            dispatch(
              decreaseQuantityToZero({ uniqueId: item?.uniqueId })
            );
          }
        });
      }

      setSelectedItems([]);
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting items:', error);
    } finally {
      // Add slight delay to prevent UI flickering
      setTimeout(() => setIsDeleting(false), 200);
    }
  }, [selectedItems, cartItems, dispatch, setSelectedItems, setIsEditing]);

  // Early return for cart tab
  if (activeTab === 'cart') {
    return (
      <>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: isEditing ? 0 : 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          {hasCartItems ? (
            cartItemsArray.map((item) => (
              <DiscoveryCartItem
                key={item.uniqueId}
                item={item}
                isEditing={isEditing}
                isSelected={selectedItems.includes(item.uniqueId)}
                onToggleSelect={() => toggleSelectItem(item.uniqueId)}
              />
            ))
          ) : (
            <EmptyCart />
          )}
        </ScrollView>

        {isEditing && selectedItems.length > 0 ? (
          <TouchableOpacity
            className={`my-2 px-20 py-6 rounded-xl ${isDeleting ? 'bg-red-400' : 'bg-red-500'}`}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <CustomText className="text-text text-center" fontWeight="semibold" variant="button">
              {isDeleting ? 'Deleting...' : `Delete (${selectedItems.length})`}
            </CustomText>
          </TouchableOpacity>
        ) : (
          <>{hasCartItems && <CartPopUp />}</>
        )}
      </>
    );
  }

  // Order history tab
  if (loading) {
    return (
      <View className="flex-1 mt-10 justify-center items-center">
        <LoadingPlaceholder />
        <CustomText fontSize="md" className="mt-4" style={{ color: appTheme.textSecondary }}>
          Loading your orders...
        </CustomText>
      </View>
    );
  }

  if (error) {
    return <DisplayErrorCard message={error?.message || 'Unable to fetch the Orders please try again.'} />;
  }

  if (orders.length === 0) {
    return (
      <OrderHistoryNoData
        onBrowse={() => {
          /* navigate to browse */
        }}
      />
    );
  }

  return <OrderHistoryList orders={groupedOrders} />;
};

export default DiscoveryCartTabContent;
