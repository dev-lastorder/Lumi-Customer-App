// index.tsx

import type { FC } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';

import { ProductDetailContent } from './ui-components';
import { useDispatch } from 'react-redux';
import {
  closeProductDetailModal,
  selectActionButtonText,
  selectAvailableAddons,
  selectCurrentVariation,
  selectHasVariations,
  selectIsAddToCartDisabled,
  selectIsProductDisabled,
  selectIsVariationSelectionMissing,
  selectTotalPrice,
  setProductModalQuantity,
  setProductModalVariation,
  toggleProductModalAddon,
} from '@/redux/slices/productModalSlice';
import { setQuantity, useAppSelector } from '@/redux';
import { Alert } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT_RATIO = 0.9;
const IMAGE_HEIGHT_RATIO = 0.35;

export const ProductDetailModal: FC = () => {
  const dispatch = useDispatch();
  const { isVisible, product, currentQuantity, selectedVariationId, selectedAddonIds } = useAppSelector(state => state.productModal);

  const currentVariation = useAppSelector(selectCurrentVariation);
  const availableAddons = useAppSelector(selectAvailableAddons);
  const totalPrice = useAppSelector(selectTotalPrice);
  const isProductDisabled = useAppSelector(selectIsProductDisabled);
  const hasVariations = useAppSelector(selectHasVariations);
  const isVariationSelectionMissing = useAppSelector(selectIsVariationSelectionMissing);
  const isAddToCartDisabled = useAppSelector(selectIsAddToCartDisabled);
  const actionButtonText = useAppSelector(selectActionButtonText);

  const closeModal = () => dispatch(closeProductDetailModal());

  const changeQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(setProductModalQuantity(newQuantity));
    }
  };

  const selectVariation = (variationId: string) => {
    dispatch(setProductModalVariation(variationId));
  };

  const toggleAddon = (addonId: string) => {
    dispatch(toggleProductModalAddon(addonId));
  };

  const handleSubmit = () => {
    if (isVariationSelectionMissing) {
      Alert.alert('Selection Required', 'Please select a variation before adding to your order.');
      return;
    }
    if (isProductDisabled) {
      Alert.alert('Product Unavailable', 'This item cannot be added to your order at this time.');
      return;
    }
    if (!product || !selectedVariationId) return;

    dispatch(
      setQuantity({
        product,
        variationId: selectedVariationId,
        selectedAddonIds,
        quantity: currentQuantity,
      })
    );
    closeModal();
  };

  if (!isVisible || !product) {
    return null;
  }

  const modalHeight = SCREEN_HEIGHT * MODAL_HEIGHT_RATIO;
  const imageHeight = SCREEN_HEIGHT * IMAGE_HEIGHT_RATIO;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      backdropOpacity={0.7}
      propagateSwipe
      avoidKeyboard
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View className="bg-background dark:bg-dark-background rounded-t-3xl overflow-hidden" style={{ height: modalHeight }}>
        <ProductDetailContent
          imageHeight={imageHeight}
          product={product}
          currentQuantity={currentQuantity}
          selectedVariationId={selectedVariationId}
          selectedAddonIds={selectedAddonIds}
          currentVariation={currentVariation}
          availableAddons={availableAddons}
          totalPrice={totalPrice}
          basePrice={currentVariation?.price ?? product?.price ?? 0}
          hasVariations={hasVariations}
          isAddToCartDisabled={isAddToCartDisabled}
          isProductDisabled={isProductDisabled}
          actionButtonText={actionButtonText}
          closeModal={closeModal}
          changeQuantity={changeQuantity}
          selectVariation={selectVariation}
          toggleAddon={toggleAddon}
          handleSubmit={handleSubmit}
        />
      </View>
    </Modal>
  );
};
