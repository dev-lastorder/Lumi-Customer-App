import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { DiscoveryCartHeaderWithTabs, DiscoveryCartTabContent } from '../../components';
import { router } from 'expo-router';
import { useAppSelector } from '@/redux';

const CartScreen = () => {
  const [activeTab, setActiveTab] = useState<'cart' | 'order'>('cart');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const cartItems = useAppSelector((state) => state.cart.items);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  // Memoize item IDs to prevent unnecessary recalculations
  const itemIds = useMemo(() => Object.values(cartItems).map((item) => item.uniqueId), [cartItems]);

  // Reset editing state when cart becomes empty
  useEffect(() => {
    if (totalQuantity === 0 && isEditing) {
      setIsEditing(false);
      setSelectedItems([]);
    }
  }, [totalQuantity, isEditing]);

  // Reset selected items when switching tabs
  useEffect(() => {
    if (activeTab !== 'cart') {
      setIsEditing(false);
      setSelectedItems([]);
    }
  }, [activeTab]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === itemIds.length && itemIds.length > 0) {
      // Already all selected -> unselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(itemIds);
    }
  }, [selectedItems.length, itemIds]);

  const handleGoBack = () => {
    router?.back();
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => {
      const newIsEditing = !prev;
      // Clear selected items when exiting edit mode
      if (!newIsEditing) {
        setSelectedItems([]);
      }
      return newIsEditing;
    });
  };

  const handleTabChange = useCallback(
    (tab: 'cart' | 'order') => {
      setActiveTab(tab);
      // Reset edit state when switching tabs
      if (isEditing) {
        setIsEditing(false);
        setSelectedItems([]);
      }
    },
    [isEditing]
  );

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <DiscoveryCartHeaderWithTabs
        title="Your orders"
        onGoBack={handleGoBack}
        onEditPress={handleEditToggle}
        isEditing={isEditing}
        initialTab={activeTab}
        onTabChange={handleTabChange}
        handleSelectAll={handleSelectAll}
        totalQuantity={totalQuantity}
      />

      <DiscoveryCartTabContent
        activeTab={activeTab}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </View>
  );
};

export default CartScreen;
