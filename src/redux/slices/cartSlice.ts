// src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductAddon, ProductVariation } from '@/utils/interfaces/product-detail';
import { CartItem, CartItemUniqueId } from '@/utils/interfaces/cart';
import { persistor, RootState } from '../store'; // Assuming your store setup
import { IRestaurant } from '@/api';
import { Restaurant } from '@/utils';

// Import all necessary product interfaces
interface CheckoutDetails {
  orderMode: 'Delivery' | 'Pickup';
  shippingAddressId: string | null | undefined;
  shippingAddress: string;
  shippingLatitude: string;
  shippingLongitude: string;
  addressDetails: string | null | undefined;
  leaveAtDoor: boolean;
  sendAsGift: boolean;
  courierInstructions: string;
  deliveryOption: 'Standard' | 'Schedule';
  scheduledTime?: string;
  paymentMethod: 'COD' | 'Stripe';
  couponCode: string;
  couponDiscount: number; // Optional discount from coupon
  tip: number;
}
interface CartState {
  storeDetails?: Restaurant | null;
  items: Record<CartItemUniqueId, CartItem>; // Stores items by their uniqueId
  totalQuantity: number; // Sum of all item quantities
  totalPrice: number; // Sum of (item.unitPrice * item.quantity)
  currentRestaurantId: string | null; // ID of the restaurant for the current cart
  isShowConfirmationModal: boolean;
  isCartPopupVisible: boolean;
  checkout: CheckoutDetails; // Details for checkout process
  pendingItem?: {
    product: Product;
    variationId: string;
    selectedAddonIds: string[];
    quantity: number;
  } | null;

}

const initialCheckout: CheckoutDetails = {
  orderMode: 'Delivery',
  shippingAddressId: null,
  shippingAddress: '',
  shippingLatitude: '',
  shippingLongitude: '',
  addressDetails: '',
  leaveAtDoor: false,
  sendAsGift: false,
  courierInstructions: '',
  deliveryOption: 'Standard',
  scheduledTime: undefined,
  paymentMethod: 'COD',
  couponCode: '',
  couponDiscount: 0, // Optional, can be set later
  tip: 0,
};

const initialState: CartState = {
  items: {},
  totalQuantity: 0,
  totalPrice: 0,
  currentRestaurantId: null,
  isShowConfirmationModal: false,
  isCartPopupVisible: true,
  checkout: initialCheckout,
  pendingItem: null,
};

// Helper function to generate a unique ID for a cart item configuration
const generateUniqueCartItemId = (productId: string, variationId: string, selectedAddonIds: string[]): CartItemUniqueId => {
  const sortedAddons = [...selectedAddonIds].sort();
  return `${productId}_${variationId}_${sortedAddons.join('_')}`;
};

// Helper to calculate the price for a single unit of a configured item
const calculateUnitPrice = (variation: ProductVariation, selectedAddonDetails: ProductAddon[]): number => {
  const variationPrice = variation.price;
  const addonsPrice = selectedAddonDetails.reduce((sum, addon) => sum + addon.price, 0);
  return variationPrice + addonsPrice;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartPopupVisibility: (state, action: PayloadAction<boolean>) => {
      state.isCartPopupVisible = action.payload;
    },
    setPendingItem: (
      state,
      action: PayloadAction<{
        product: Product;
        variationId: string;
        selectedAddonIds: string[];
        quantity: number;
      }>
    ) => {
      state.pendingItem = action.payload;
    },

    // setQuantity: (
    //   state,
    //   action: PayloadAction<{
    //     product: Product;
    //     variationId: string;
    //     selectedAddonIds: string[];
    //     quantity: number;
    //   }>
    // ) => {
    //   const { product, variationId, selectedAddonIds, quantity } = action.payload;
    //   const restaurantId = product.restaurantId;
    //   // 1. Handle Restaurant ID logic
    //   if (state.currentRestaurantId === null && quantity > 0) {
    //     // If cart is empty and we are adding an item, set this restaurant as the cart's restaurant
    //     state.currentRestaurantId = restaurantId;
    //   } else if (state.currentRestaurantId !== null && state.currentRestaurantId !== restaurantId && quantity > 0) {
    //     state.isShowConfirmationModal = true;
    //   }

    //   // If quantity is 0 or less, and no items will be in the cart, ensure restaurantId is cleared.
    //   // This check is more robustly handled at the end after quantity adjustments.

    //   const uniqueId = generateUniqueCartItemId(product.id, variationId, selectedAddonIds);
    //   const existingItem = state.items[uniqueId];

    //   const selectedVariation = product.variations?.find((v) => v.id === variationId);
    //   if (!selectedVariation) {
    //     console.warn(`Variation with ID ${variationId} not found for product ${product.id}.`);
    //     return;
    //   }

    //   const selectedAddonDetails = product.addons?.filter((addon) => selectedAddonIds.includes(addon.id)) || [];
    //   const unitPrice = calculateUnitPrice(selectedVariation, selectedAddonDetails);

    //   if (quantity <= 0) {
    //     if (existingItem) {
    //       state.totalQuantity -= existingItem.quantity;
    //       state.totalPrice -= existingItem.quantity * existingItem.unitPrice;
    //       delete state.items[uniqueId];
    //     }
    //   } else {
    //     // Only proceed if the restaurant ID matches or if the cart is being newly populated by this restaurant
    //     if (state.currentRestaurantId === restaurantId) {
    //       if (existingItem) {
    //         const quantityDifference = quantity - existingItem.quantity;
    //         existingItem.quantity = quantity;
    //         existingItem.unitPrice = unitPrice; // Ensure unit price is consistent
    //         state.totalQuantity += quantityDifference;
    //         state.totalPrice += quantityDifference * unitPrice; // Use the correct unitPrice for calculation
    //       } else {
    //         const newItem: CartItem = {
    //           product,
    //           uniqueId: uniqueId,
    //           productId: product.id,
    //           variationId: variationId,
    //           selectedAddonIds: [...selectedAddonIds].sort(),
    //           productTitle: product.title,
    //           variationTitle: selectedVariation.title,
    //           imageUrl: product.image,
    //           currency: product.currency,
    //           basePrice: selectedVariation.price,
    //           addonPrices: selectedAddonDetails.map((addon) => ({
    //             id: addon.id,
    //             title: addon.title,
    //             price: addon.price,
    //           })),
    //           unitPrice: unitPrice,
    //           quantity: quantity,
    //         };
    //         state.items[uniqueId] = newItem;
    //         state.totalQuantity += quantity;
    //         state.totalPrice += quantity * unitPrice;
    //       }
    //     } else if (state.currentRestaurantId === null) {
    //       // This case should be covered by the initial check that sets currentRestaurantId
    //       // But as a fallback, if it's null, this item sets it.
    //       state.currentRestaurantId = restaurantId;
    //       // And then add the item (duplicate of "else" block above - can be refactored)
    //       const newItem: CartItem = {
    //         product,
    //         uniqueId: uniqueId,
    //         productId: product.id,
    //         variationId: variationId,
    //         selectedAddonIds: [...selectedAddonIds].sort(),
    //         productTitle: product.title,
    //         variationTitle: selectedVariation.title,
    //         imageUrl: product.image,
    //         currency: product.currency,
    //         basePrice: selectedVariation.price,
    //         addonPrices: selectedAddonDetails.map((addon) => ({
    //           id: addon.id,
    //           title: addon.title,
    //           price: addon.price,
    //         })),
    //         unitPrice: unitPrice,
    //         quantity: quantity,
    //       };
    //       state.items[uniqueId] = newItem;
    //       state.totalQuantity += quantity;
    //       state.totalPrice += quantity * unitPrice;
    //       state.currentRestaurantId = restaurantId;
    //     }
    //     // If state.currentRestaurantId is not null and doesn't match restaurantId,
    //     // we don't add the item here. The console.warn above would have triggered.
    //   }

    //   // 2. After all operations, if cart becomes empty, reset restaurantId
    //   if (state.totalQuantity === 0) {
    //     state.currentRestaurantId = null;
    //     // Ensure items and totalPrice are also definitively zeroed out if totalQuantity is zero
    //     state.items = {};
    //     state.totalPrice = 0;
    //   }
    //   state.isCartPopupVisible = state.totalQuantity > 0 && state.currentRestaurantId === action.payload.product.restaurantId;
    // },

    setQuantity: (
      state,
      action: PayloadAction<{
        product: Product;
        variationId: string;
        selectedAddonIds: string[];
        quantity: number;
      }>
    ) => {
      const { product, variationId, selectedAddonIds, quantity } = action.payload;
      const restaurantId = product.restaurantId;

      console.log('🛒 setQuantity Debug - Action payload:', {
        productId: product.id,
        productTitle: product.title,
        restaurantId,
        variationId,
        selectedAddonIds,
        quantity,
        currentRestaurantId: state.currentRestaurantId,
        currentTotalQuantity: state.totalQuantity,
      });

      // 1. Handle Restaurant ID logic
      if (state.currentRestaurantId === null && quantity > 0) {
        state.currentRestaurantId = restaurantId;
      } else if (state.currentRestaurantId !== null && state.currentRestaurantId !== restaurantId && quantity > 0) {
        state.isShowConfirmationModal = true;
        state.pendingItem = {
          product,
          variationId,
          selectedAddonIds,
          quantity,
        };
        return; // Exit early if showing confirmation modal
      }

      const uniqueId = generateUniqueCartItemId(product.id, variationId, selectedAddonIds);
      const existingItem = state.items[uniqueId];

      console.log('variationId', variationId, 'Product Variations', JSON.stringify(product.variations, null, 2));

      const selectedVariation = product.variations?.find((v) => v.id === variationId);
      if (!selectedVariation) {
        console.warn(`🛒 setQuantity - Variation with ID ${variationId} not found for product ${product.id}.`);
        return;
      }

      const selectedAddonDetails = product?.variations?.addons?.filter((addon: { id: string }) => selectedAddonIds.includes(addon.id)) || [];
      const unitPrice = calculateUnitPrice(selectedVariation, selectedAddonDetails);

      if (quantity <= 0) {
        if (existingItem) {
          state.totalQuantity -= existingItem.quantity;
          state.totalPrice -= existingItem.quantity * existingItem.unitPrice;
          delete state.items[uniqueId];
          console.log('🛒 setQuantity - Item removed, new totals:', {
            totalQuantity: state.totalQuantity,
            totalPrice: state.totalPrice,
          });
        }
      } else {
        // Only proceed if the restaurant ID matches or if the cart is being newly populated by this restaurant
        if (state.currentRestaurantId === restaurantId) {
          if (existingItem) {
            const quantityDifference = quantity - existingItem.quantity;
            existingItem.quantity = quantity;
            existingItem.unitPrice = unitPrice;
            state.totalQuantity += quantityDifference;
            state.totalPrice += quantityDifference * unitPrice;
          } else {
            console.log('running else block');
            const newItem: CartItem = {
              product,
              uniqueId: uniqueId,
              productId: product.id,
              variationId: variationId,
              selectedAddonIds: [...selectedAddonIds].sort(),
              productTitle: product.title,
              variationTitle: selectedVariation.title,
              imageUrl: product.image,
              currency: product.currency,
              basePrice: selectedVariation.price,
              addonPrices: selectedAddonDetails.map((addon: { id: any; title: any; price: any }) => ({
                id: addon.id,
                title: addon.title,
                price: addon.price,
              })),
              unitPrice: unitPrice,
              quantity: quantity,
            };
            console.log({ newItem });
            state.items[uniqueId] = newItem;
            state.totalQuantity += quantity;
            state.totalPrice += quantity * unitPrice;
          }

          console.log('🛒 setQuantity - After add/update, new totals:', {
            totalQuantity: state.totalQuantity,
            totalPrice: state.totalPrice,
            itemsCount: Object.keys(state.items).length,
          });
        }
      }

      // 2. After all operations, if cart becomes empty, reset restaurantId
      if (state.totalQuantity === 0) {
        state.currentRestaurantId = null;
        state.items = {};
        state.totalPrice = 0;
      }

      // Set cart popup visibility
      const shouldShowPopup = state.totalQuantity > 0 && state.currentRestaurantId === restaurantId;
      console.log('🛒 setQuantity - Setting cart popup visibility:', {
        shouldShowPopup,
        totalQuantity: state.totalQuantity,
        currentRestaurantId: state.currentRestaurantId,
        actionRestaurantId: restaurantId,
      });

      state.isCartPopupVisible = shouldShowPopup;
    },

    decreaseQuantityToZero: (state, action: PayloadAction<{ uniqueId: string }>) => {
      const { uniqueId } = action.payload;
      const item = state.items[uniqueId];
      if (!item) return;

      const restaurantId = item.product.restaurantId;

      // Update totalsj
      const totalItemPrice = item.unitPrice * item.quantity;
      state.totalPrice -= totalItemPrice;
      state.totalQuantity -= item.quantity;

      // Remove the item
      delete state.items[uniqueId];

      // If cart is empty -> reset everything
      if (state.totalQuantity === 0) {
        state.currentRestaurantId = null;
        state.items = {};
        state.totalPrice = 0;
        state.isCartPopupVisible = true;
        console.log('🛒 Cart is now empty. Resetting state.');
      } else {
        // Otherwise, keep popup visible
        state.isCartPopupVisible = state.currentRestaurantId === restaurantId;
        console.log('🛒 Cart still has items. Popup stays visible:', state.isCartPopupVisible);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<{ uniqueId: string }>) => {
      const { uniqueId } = action.payload;
      const item = state.items[uniqueId];
      if (!item) return;

      state.totalQuantity -= 1;
      state.totalPrice -= item.unitPrice;

      if (item.quantity === 1) {
        delete state.items[uniqueId];
      } else {
        item.quantity -= 1;
      }

      if (state.totalQuantity === 0) {
        state.currentRestaurantId = null;
        state.items = {};
        state.totalPrice = 0;
        state.isCartPopupVisible = false;
      }
    },

    increaseQuantity: (state, action: PayloadAction<{ uniqueId: string }>) => {
      const { uniqueId } = action.payload;
      const item = state.items[uniqueId];
      if (!item) return; // Guard

      item.quantity += 1;
      state.totalQuantity += 1;
      state.totalPrice += item.unitPrice;
    },

    // ─── New action for setting shipping address + coords ─────────────────
    setShippingAddress: (
      state,
      action: PayloadAction<{
        addressId: string;
        address: string;
        latitude: string;
        longitude: string;
        addressDetails?: string | null | '';
      }>
    ) => {
      // only if delivery mode
      if (state.checkout.orderMode === 'Delivery') {
        state.checkout.shippingAddressId = action.payload.addressId;
        state.checkout.shippingAddress = action.payload.address;
        state.checkout.shippingLatitude = action.payload.latitude;
        state.checkout.shippingLongitude = action.payload.longitude;
        state.checkout.addressDetails = action.payload.addressDetails || '';
      }
    },

    // ─── When user switches to pickup, clear any delivery address ─────────
    setOrderMode: (state, action: PayloadAction<'Delivery' | 'Pickup'>) => {
      state.checkout.orderMode = action.payload;
      /*   if (action.payload === 'Pickup') {
        state.checkout.shippingAddressId = null;
        state.checkout.shippingAddress = '';
        state.checkout.shippingLatitude = '';
        state.checkout.shippingLongitude = '';
      } */
    },

    setCouponDiscount: (state, action: PayloadAction<{ discount: number }>) => {
      const { discount } = action.payload;
      state.checkout.couponDiscount = discount;
    },

    toggleLeaveAtDoor(state, action: PayloadAction<boolean>) {
      state.checkout.leaveAtDoor = action.payload;
    },
    toggleSendAsGift(state, action: PayloadAction<boolean>) {
      state.checkout.sendAsGift = action.payload;
    },
    setCourierInstructions(state, action: PayloadAction<string>) {
      state.checkout.courierInstructions = action.payload;
    },
    setDeliveryOption(state, action: PayloadAction<'Standard' | 'Schedule'>) {
      state.checkout.deliveryOption = action.payload;
    },
    setScheduledTime(state, action: PayloadAction<string>) {
      state.checkout.scheduledTime = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<'COD' | 'Stripe'>) {
      state.checkout.paymentMethod = action.payload;
    },
    setCouponCode(state, action: PayloadAction<string>) {
      state.checkout.couponCode = action.payload;
    },
    setTip(state, action: PayloadAction<number>) {
      state.checkout.tip = action.payload;
    },

    setRestaurantId: (state, action: PayloadAction<string>) => {
      state.currentRestaurantId = action.payload;
    },

    setPastOrderAddress: (state, action: PayloadAction<any>) => {
      state.checkout.shippingAddress = action.payload.address;
      state.checkout.shippingAddressId = action.payload.addressId;
      state.checkout.shippingLatitude = action.payload.latitude;
      state.checkout.shippingLongitude = action.payload.longitude;
      state.checkout.addressDetails = action.payload.addressDetails;
    },

    // clear cart local storage and reset state
    clearCartLocalStorage: () => {
      cartSlice.getInitialState(); // Clear persisted state
    },

    clearCart: (state) => {
      state.items = {};
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.currentRestaurantId = null; // Reset restaurant ID on clear
      state.isShowConfirmationModal = false;
      state.isCartPopupVisible = false;
      state.checkout = { ...initialCheckout };
      state.storeDetails = null;
    },
    closeConfirmationModal: (state) => {
      state.isShowConfirmationModal = false;
    },
  },
});

// Selector to get the current cart's restaurant ID
export const selectCartRestaurantId = (state: RootState): string | null => state.cart.currentRestaurantId;

export const selectQuantityByProduct = (state: RootState, productId: string, variationId: string, selectedAddonIds: string[]): number => {
  const uniqueId = generateUniqueCartItemId(productId, variationId, selectedAddonIds);
  const item = state.cart.items[uniqueId];
  return item ? item.quantity : 0;
};

export const {
  setQuantity,
  clearCart,
  closeConfirmationModal,
  decreaseQuantity,
  increaseQuantity,
  setCartPopupVisibility,
  setOrderMode,
  setShippingAddress,
  toggleLeaveAtDoor,
  toggleSendAsGift,
  setCourierInstructions,
  setDeliveryOption,
  setScheduledTime,
  setPaymentMethod,
  setCouponCode,
  setCouponDiscount,
  setTip,
  setRestaurantId,
  setPastOrderAddress,
  clearCartLocalStorage,
  decreaseQuantityToZero,
} = cartSlice.actions;

export default cartSlice.reducer;
