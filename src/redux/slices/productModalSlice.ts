// src/redux/slices/productModalSlice.ts
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Product, ProductAddon } from '@/utils/interfaces/product-detail'; // Adjust path if needed
import { RootState } from '@/redux/store';

// Define the state structure for your ProductDetailModal
export interface ProductModalState {
  isVisible: boolean;
  product: Product | null;
  selectedVariationId: string | null; // Tracks the variation currently selected within the modal
  selectedAddonIds: string[]; // Tracks the addons currently selected within the modal
  currentQuantity: number;
  actionType: 'add' | 'edit'; // 'add' for new item, 'edit' for modifying an existing one
}

const initialState: ProductModalState = {
  isVisible: false,
  product: null,
  selectedVariationId: null, // No variation selected initially
  selectedAddonIds: [], // No addons selected initially
  currentQuantity: 1, // Default quantity when opening
  actionType: 'add', // Default action is to add a new item
};

const productModalSlice = createSlice({
  name: 'productModal',
  initialState,
  reducers: {
    /**
     * Opens the product detail modal.
     * Allows pre-selection of variation, addons, and quantity for editing existing items.
     */
    openProductDetailModal: (
      state,
      action: PayloadAction<{
        product: Product;
        initialVariationId?: string; // The variation ID to pre-select in the modal
        initialAddonIds?: string[]; // The addon IDs to pre-select in the modal
        initialQuantity?: number;
        actionType?: 'add' | 'edit'; // 'add' for new item, 'edit' for modifying existing
      }>
    ) => {
      state.isVisible = true;
      state.product = action.payload.product;

      // Initialize internal modal selection states based on payload
      // If initialVariationId is provided, use it. Otherwise, default to the first variation if available, or null.
      state.selectedVariationId = action.payload.initialVariationId || action.payload.product.variations?.[0]?.id || null;

      // If initialAddonIds are provided, use them. Otherwise, default to an empty array.
      state.selectedAddonIds = action.payload.initialAddonIds || [];

      // Set initial quantity.
      state.currentQuantity = action.payload.initialQuantity ?? 1;

      // Set the action type (add or edit).
      state.actionType = action.payload.actionType ?? 'add';
    },

    /**
     * Closes the product detail modal and resets its state.
     */
    closeProductDetailModal: (state) => {
      state.isVisible = false;
      // Clear all related product/selection data when closed
      state.product = null;
      state.selectedVariationId = null;
      state.selectedAddonIds = [];
      state.currentQuantity = 1;
      state.actionType = 'add'; // Reset action type
    },

    /**
     * Updates the quantity within the modal.
     */
    setProductModalQuantity: (state, action: PayloadAction<number>) => {
      state.currentQuantity = action.payload;
    },

    /**
     * Sets the selected variation within the modal.
     * Typically clears selected addons when a new variation is chosen.
     */
    setProductModalVariation: (state, action: PayloadAction<string>) => {
      state.selectedVariationId = action.payload;
      state.selectedAddonIds = []; // Common behavior: clear addons when variation changes
    },

    /**
     * Toggles an addon's selection status within the modal.
     */
    toggleProductModalAddon: (state, action: PayloadAction<string>) => {
      const addonId = action.payload;
      if (state.selectedAddonIds.includes(addonId)) {
        state.selectedAddonIds = state.selectedAddonIds.filter((id) => id !== addonId);
      } else {
        state.selectedAddonIds.push(addonId);
      }
      // Ensure addons are sorted for consistent uniqueId generation if needed for comparison later
      state.selectedAddonIds.sort();
    },

    /**
     * Manually sets the action type (add or edit) for the modal.
     * This might be useful if the action type needs to change based on user interaction within the modal itself.
     */
    setProductModalActionType: (state, action: PayloadAction<'add' | 'edit'>) => {
      state.actionType = action.payload;
    },
  },
});

export const {
  openProductDetailModal,
  closeProductDetailModal,
  setProductModalQuantity,
  setProductModalVariation,
  toggleProductModalAddon,
  setProductModalActionType,
} = productModalSlice.actions;

export default productModalSlice.reducer;

// Selectors
const selectProductModalState = (state: RootState) => state.productModal;

export const selectCurrentVariation = createSelector(
  selectProductModalState,
  (productModal) => productModal.product?.variations?.find((v) => v.id === productModal.selectedVariationId)
);

export const selectAvailableAddons = createSelector(
  selectCurrentVariation,
  (currentVariation) => currentVariation?.addons || []
);

export const selectUnitPrice = createSelector(
  selectProductModalState,
  selectCurrentVariation,
  selectAvailableAddons,
  (productModal, currentVariation, availableAddons) => {
    const basePrice = currentVariation?.price ?? productModal.product?.price ?? 0;
    const addonsPrice = availableAddons.reduce(
      (total, addon) => (productModal.selectedAddonIds.includes(addon.id) ? total + addon.price : total),
      0
    );
    return basePrice + addonsPrice;
  }
);

export const selectTotalPrice = createSelector(
  selectUnitPrice,
  selectProductModalState,
  (unitPrice, productModal) => unitPrice * productModal.currentQuantity
);

export const selectIsProductDisabled = createSelector(
  selectProductModalState,
  (productModal) => productModal.product?.isOutOfStock || !productModal.product?.isActive
);

export const selectHasVariations = createSelector(
  selectProductModalState,
  (productModal) => !!(productModal.product?.variations && productModal.product.variations.length > 0)
);

export const selectIsVariationSelectionMissing = createSelector(
  selectHasVariations,
  selectProductModalState,
  (hasVariations, productModal) => hasVariations && !productModal.selectedVariationId
);

export const selectIsAddToCartDisabled = createSelector(
  selectIsProductDisabled,
  selectIsVariationSelectionMissing,
  (isProductDisabled, isVariationSelectionMissing) => isProductDisabled || isVariationSelectionMissing
);

export const selectActionButtonText = createSelector(
  selectProductModalState,
  (productModal) => {
    if (productModal.product?.isOutOfStock) return 'Out of Stock';
    if (!productModal.product?.isActive) return 'Unavailable';
    return productModal.actionType === 'add' ? 'Add to order' : 'Update Item';
  }
);

