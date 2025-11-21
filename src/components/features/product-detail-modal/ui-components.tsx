// ui-components.tsx

import type { FC } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';

import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';
import { Product, ProductAddon, ProductVariation } from '@/utils/interfaces/product-detail';

interface ProductDetailContentProps {
  imageHeight: number;
  product: Product | null;
  currentQuantity: number;
  selectedVariationId: string | null;
  selectedAddonIds: string[];
  currentVariation: ProductVariation | undefined;
  availableAddons: ProductAddon[];
  totalPrice: number;
  basePrice: number;
  hasVariations: boolean;
  isAddToCartDisabled: boolean;
  isProductDisabled: boolean;
  actionButtonText: string;
  closeModal: () => void;
  changeQuantity: (newQuantity: number) => void;
  selectVariation: (variationId: string) => void;
  toggleAddon: (addonId: string) => void;
  handleSubmit: () => void;
}

interface ModalHeaderProps {
  closeModal: () => void;
}

interface ProductImageProps {
  imageHeight: number;
  product: Product | null;
}

interface ProductInfoProps {
  product: Product | null;
  basePrice: number;
}

interface VariationSelectorProps {
  product: Product | null;
  hasVariations: boolean;
  selectedVariationId: string | null;
  selectVariation: (variationId: string) => void;
  isProductDisabled: boolean;
}

interface AddonSelectorProps {
  product: Product | null;
  availableAddons: ProductAddon[];
  selectedAddonIds: string[];
  toggleAddon: (addonId: string) => void;
  isProductDisabled: boolean;
}

interface QuantityControlProps {
  currentQuantity: number;
  changeQuantity: (newQuantity: number) => void;
  isProductDisabled: boolean;
}

interface ActionButtonProps {
  product: Product | null;
  totalPrice: number;
  isAddToCartDisabled: boolean;
  actionButtonText: string;
  handleSubmit: () => void;
}

interface ModalFooterProps extends QuantityControlProps, ActionButtonProps { }

const ModalHeader: FC<ModalHeaderProps> = ({ closeModal }) => {
  return (
    <>
      <View className="items-center absolute top-1= z-10 left-0 right-0  py-3">
        <View className="w-10 h-1 rounded-full bg-grey dark:bg-dark-grey" />
      </View>
      <TouchableOpacity
        className="absolute top-8 right-4 bg-background/50 dark:bg-dark-background/50 rounded-full p-2 z-10"
        onPress={closeModal}
        activeOpacity={0.7}
      >
        <CustomIcon icon={{ name: 'keyboard-arrow-down', type: 'MaterialIcons', size: adjust(24) }} className="text-text dark:text-dark-text" />
      </TouchableOpacity>
    </>
  );
};

const ProductImage: FC<ProductImageProps> = ({ imageHeight, product }) => {
  const imageUrl = product?.image || 'https://via.placeholder.com/400x300.png?text=No+Image';
  return <Image source={{ uri: imageUrl }} className="w-full bg-bgLight dark:bg-dark-bgLight" style={{ height: imageHeight }} resizeMode="cover" />;
};

const ProductInfo: FC<ProductInfoProps> = ({ product, basePrice }) => {
  if (!product) return null;
  return (
    <>
      <CustomText variant="heading3" fontWeight="bold" className="mb-2">
        {product.title}
      </CustomText>
      <CustomText variant="subheading" fontWeight="bold" className="text-primary dark:text-dark-primary mb-4" isDefaultColor={false}>
        {`${basePrice.toFixed(2)} ${product.currency || '€'}`}
      </CustomText>
      {product.description && (
        <CustomText variant='caption' fontFamily='Inter' className="text-text-secondary dark:text-dark-text-secondary leading-relaxed" isDefaultColor={false}>
          {product.description}
        </CustomText>
      )}
    </>
  );
};

type OptionItemProps = {
  id: string;
  title: string;
  price: number;
  currency: string;
  isSelected: boolean;
  onPress: (id: string) => void;
  type: 'radio' | 'checkbox';
  disabled?: boolean;
  pricePrefix?: string;
};

const OptionItem: FC<OptionItemProps> = ({ id, title, price, currency, isSelected, onPress, type, disabled, pricePrefix = '' }) => {
  const Radio = () => (
    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${isSelected ? 'border-primary' : 'border-border'}`}>
      {isSelected && <View className="w-3 h-3 rounded-full bg-primary" />}
    </View>
  );

  const Checkbox = () => (
    <View className={`w-6 h-6 rounded border-2 items-center justify-center mr-4 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
      {isSelected && <CustomIcon icon={{ name: 'check', type: 'MaterialIcons', size: adjust(16) }} className="text-white" />}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      disabled={disabled}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between py-4 ${disabled ? 'opacity-60' : ''}`}
    >
      <View className="flex-row items-center flex-1 mr-4">
        {type === 'radio' ? <Radio /> : <Checkbox />}
        <CustomText variant='label' fontFamily='Inter' className="text-text dark:text-dark-text flex-1">{title}</CustomText>
      </View>
      <CustomText variant='label' fontWeight='bold' className="text-text-secondary dark:text-dark-text-secondary">{`${pricePrefix}${price?.toFixed(2) || '0.00'} ${currency}`}</CustomText>
    </TouchableOpacity>
  );
};

const VariationSelector: FC<VariationSelectorProps> = ({ product, hasVariations, selectedVariationId, selectVariation, isProductDisabled }) => {
  if (!hasVariations || !product?.variations) return null;

  return (
    <View className="my-6">
      <CustomText variant="body" fontWeight="bold" className="text-text dark:text-dark-text mb-2">
        Select Variation
      </CustomText>
      {product.variations.map((variation) => (
        <OptionItem
          key={variation.id}
          id={variation.id}
          title={variation.title}
          price={variation.price}
          currency={product.currency || '€'}
          isSelected={selectedVariationId === variation.id}
          onPress={selectVariation}
          type="radio"
          disabled={isProductDisabled}
        />
      ))}
    </View>
  );
};

const AddonSelector: FC<AddonSelectorProps> = ({ product, availableAddons, selectedAddonIds, toggleAddon, isProductDisabled }) => {
  if (!availableAddons?.length || !product) return null;

  return (
    <View className="my-6">
      <CustomText variant="body" fontWeight="bold" className="text-text dark:text-dark-text mb-2">
        Choose your Extras
      </CustomText>
      {availableAddons.map((addon) => (
        <OptionItem
          key={addon.id}
          id={addon.id}
          title={addon.title}
          price={addon.price}
          currency={product.currency || '€'}
          isSelected={selectedAddonIds.includes(addon.id)}
          onPress={toggleAddon}
          type="checkbox"
          disabled={isProductDisabled}
          pricePrefix="+ "
        />
      ))}
    </View>
  );
};

const QuantityControl: FC<QuantityControlProps> = ({ currentQuantity, changeQuantity, isProductDisabled }) => {
  const isDecrementDisabled = isProductDisabled || currentQuantity <= 1;
  const iconColor = (disabled: boolean) => (disabled ? 'text-disabled dark:text-dark-disabled' : 'text-primary dark:text-dark-primary');

  return (
    <View className="flex-row items-center bg-icon-background dark:bg-dark-icon-background rounded-lg p-3 mr-4">
      <TouchableOpacity
        onPress={() => changeQuantity(currentQuantity - 1)}
        disabled={isDecrementDisabled}
        activeOpacity={0.7}
        className="items-center justify-center p-1 bg-card dark:bg-dark-card rounded-full"
      >
        <CustomIcon icon={{ name: 'remove', type: 'MaterialIcons', size: adjust(16) }} />
      </TouchableOpacity>
      <CustomText variant="label" fontWeight="semibold" className={`mx-3 min-w-[24px] text-center`}>
        {currentQuantity}
      </CustomText>
      <TouchableOpacity
        onPress={() => changeQuantity(currentQuantity + 1)}
        disabled={isProductDisabled}
        activeOpacity={0.7}
        className=" items-center justify-center p-1 bg-card dark:bg-dark-card rounded-full"
      >
        <CustomIcon icon={{ name: 'add', type: 'MaterialIcons', size: adjust(16) }} />
      </TouchableOpacity>
    </View>
  );
};

const ActionButton: FC<ActionButtonProps> = ({ product, totalPrice, isAddToCartDisabled, actionButtonText, handleSubmit }) => {
  const buttonStyle = isAddToCartDisabled ? 'bg-disabled dark:bg-dark-disabled' : 'bg-primary dark:bg-dark-primary';

  return (
    <TouchableOpacity
      onPress={handleSubmit}
      disabled={isAddToCartDisabled}
      activeOpacity={0.8}
      className={`flex-1 py-3 rounded-lg items-center justify-center gap-2 ${buttonStyle}`}
    >
      <View className='flex-row items-center gap-1 py-1'>
        <CustomText variant="label" fontWeight='semibold' >
          {actionButtonText}
        </CustomText>
        {!isAddToCartDisabled && (
          <CustomText
            variant="label"
            fontWeight="semibold"
            className="text-button-text dark:text-dark-button-text opacity-90 "
          >
            {`${totalPrice.toFixed(2)} ${product?.currency || '€'}`}
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ModalFooter: FC<ModalFooterProps> = ({ currentQuantity, changeQuantity, isProductDisabled, product, totalPrice, isAddToCartDisabled, actionButtonText, handleSubmit }) => (
  <View className="bg-card dark:bg-dark-card border-t border-border dark:border-dark-border/30 px-6 py-4">
    <View className="flex-row items-center">
      <QuantityControl currentQuantity={currentQuantity} changeQuantity={changeQuantity} isProductDisabled={isProductDisabled} />
      <ActionButton product={product} totalPrice={totalPrice} isAddToCartDisabled={isAddToCartDisabled} actionButtonText={actionButtonText} handleSubmit={handleSubmit} />
    </View>
  </View>
);

export const ProductDetailContent: FC<ProductDetailContentProps> = ({ imageHeight, product, currentQuantity, selectedVariationId, selectedAddonIds, currentVariation, availableAddons, totalPrice, basePrice, hasVariations, isAddToCartDisabled, isProductDisabled, actionButtonText, closeModal, changeQuantity, selectVariation, toggleAddon, handleSubmit }) => {
  const showSeparator = hasVariations || (availableAddons && availableAddons.length > 0);

  return (
    <>
      <ModalHeader closeModal={closeModal} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <ProductImage imageHeight={imageHeight} product={product} />
        <View className="bg-card dark:bg-dark-card px-6 pt-6">
          <ProductInfo product={product} basePrice={basePrice} />
          {showSeparator && <View className="h-px bg-border dark:bg-dark-border my-6" />}
          <VariationSelector product={product} hasVariations={hasVariations} selectedVariationId={selectedVariationId} selectVariation={selectVariation} isProductDisabled={isProductDisabled} />
          <AddonSelector product={product} availableAddons={availableAddons} selectedAddonIds={selectedAddonIds} toggleAddon={toggleAddon} isProductDisabled={isProductDisabled} />
        </View>
      </ScrollView>
      <ModalFooter currentQuantity={currentQuantity} changeQuantity={changeQuantity} isProductDisabled={isProductDisabled} product={product} totalPrice={totalPrice} isAddToCartDisabled={isAddToCartDisabled} actionButtonText={actionButtonText} handleSubmit={handleSubmit} />
    </>
  );
};
