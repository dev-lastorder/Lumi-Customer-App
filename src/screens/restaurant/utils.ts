// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { useQuery } from '@apollo/client';
import { shallowEqual } from 'react-redux';
import { selectQuantityByProduct, setCartPopupVisibility, useAppDispatch, useAppSelector } from '@/redux';
import { GET_RESTAURANT_DETAILS, GET_RESTAURANT_CATEGORIES_WITH_ITEMS } from '@/api';
import { getBaseVariationIdForItem } from '@/utils';
import { Product, ProductVariation } from '@/utils/interfaces/product-detail';
import { GetRestaurantCategoriesWithItemsAPIResponse, MenuItem, MenuCategory } from '../interfaces/restaurant-details';
import { TabLayout, TabItemLayoutsMap } from './interfaces';
import { DEFAULT_CURRENCY } from './constants';

// =====================================================================================
// UTILITIES
// =====================================================================================
export const transformCategoriesData = (data: GetRestaurantCategoriesWithItemsAPIResponse | undefined): MenuCategory[] => {
  return data?.getRestaurantCategoriesWithItems?.data?.map((apiCategory) => ({
    id: apiCategory.id,
    title: apiCategory.title,
    data: apiCategory.data.map((apiItem): MenuItem => ({ ...apiItem, name: apiItem.title })),
  })) || [];
};

export const createProductFromMenuItem = (item: MenuItem, restaurantCurrency?: string, restaurantId?: string): Product => {
  const productVariations: ProductVariation[] =
    item.variations?.length > 0
      ? item.variations
      : [{ id: getBaseVariationIdForItem(item), title: 'Standard', price: item.price, addons: [] }];

  const product: Product = {
    id: item.id,
    restaurantId,
    title: item.name,
    description: item.description,
    price: item.price,
    image: item.image || '',
    currency: item.currency || restaurantCurrency || DEFAULT_CURRENCY,
    isActive: !item.isOutOfStock,
    isOutOfStock: item.isOutOfStock || false,
    variations: productVariations,
    addons: item.addons || [],
  };

  return product;
};
