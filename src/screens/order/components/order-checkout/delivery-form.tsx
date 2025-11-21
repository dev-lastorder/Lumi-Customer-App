// src/components/checkout/DeliveryForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Switch, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// ─── Components ───────────────────────────────────────────────
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import { TipOption } from './tip-option';
import { TipEditModal } from './tip-edit-modal';

// ─── Redux ────────────────────────────────────────────────────
import {
  RootState,
  setShippingAddress,
  toggleLeaveAtDoor,
  toggleSendAsGift,
  setCourierInstructions,
  setDeliveryOption,
  setPaymentMethod,
  setCouponCode,
  setTip,
} from '@/redux';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import LocationPickerModal from '@/components/common/LocationPickerModal';
import { useQuery } from '@apollo/client';
import { ActivityIndicator } from 'react-native';

// ─── Types ─────────────────────────────────────────────────────
type SummaryItem = { label: string; value: string };
type DeliveryFormProps = {
  deliveryCharges: number;
  deliveryTime: number;
  tax: number;
  validateCoupon: (opts: { variables: { coupon: string } }) => void;
  validatingCoupon: boolean;
  paymentMethods?: { id: number; name: string; isDetailsSubmitted: boolean }[];
  source?: string;
};

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  paymentMethods,
  deliveryTime,
  deliveryCharges,
  tax,
  validateCoupon,
  validatingCoupon,
  source
}) => {
  const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);

  // ─── pull current checkout state ────────────────────────────
  const { shippingAddress, addressDetails, leaveAtDoor, sendAsGift, courierInstructions, deliveryOption, paymentMethod, tip, couponCode } =
    useSelector((s: RootState) => s.cart.checkout);

  // ─── local copies for input controls ────────────────────────
  const [addrDetails, setAddrDetails] = useState(addressDetails);
  const [courierText, setCourierText] = useState(courierInstructions);
  const [showTipModal, setShowTipModal] = useState(false);
  const couponTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── tip presets ────────────────────────────────────────────
  const TIP_OPTIONS = [0, 1, 2, 5];
  const isPresetTip = TIP_OPTIONS.includes(tip);
  const isCustom = !isPresetTip;

  // ─── summary ───────────────────────────────
  const { totalPrice, checkout, items } = useSelector((s: RootState) => s.cart);
  let itemTotal = 0;
  Object.values(items).forEach((cartItem) => {
    itemTotal += cartItem.unitPrice * cartItem.quantity;
  });
  const discountAmount = checkout.couponDiscount > 0 ? ((checkout.couponDiscount || 0) / 100) * itemTotal : 0;
  const tipAmount = checkout.tip;
  const total = itemTotal + tax + deliveryCharges - discountAmount + tipAmount;

  const SUMMARY_ITEMS = [
    { label: 'Item subtotal', value: `${totalPrice.toFixed(2)} €` },
    { label: 'Tax', value: `${tax.toFixed(2)} €` },
    { label: 'Delivery fee', value: `${deliveryCharges.toFixed(2)} €` },
    { label: 'Coupon discount', value: `- ${discountAmount.toFixed(2)} €` },
    { label: 'Tip', value: `${tipAmount.toFixed(2)} €` },
    { label: 'Total', value: `${total.toFixed(2)} €` },
  ];

  // ─── debounce auto‐apply after 10s of inactivity ─────────────
  useEffect(() => {
    if (!couponCode) return;
    if (couponTimer.current) clearTimeout(couponTimer.current);
    couponTimer.current = setTimeout(() => {
      validateCoupon({ variables: { coupon: couponCode } });
    }, 10_000);
    return () => {
      if (couponTimer.current) clearTimeout(couponTimer.current);
    };
  }, [couponCode]);

  return (
    <ScrollView className="px-6 mt-5 pt-4" keyboardShouldPersistTaps="handled">
      {/* Location row (read-only) */}
      <TouchableOpacity onPress={() => setShowLocationModal(true)} className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center">
          <CustomIcon icon={{ type: 'Entypo', name: 'location-pin', size: 32, color: '#AAC810' }} />
          <View className="ml-3">
            <CustomText variant="body" fontSize="sm" fontWeight="semibold">
              {shippingAddress || 'Set address'}
            </CustomText>
            <CustomText variant="label" fontSize="sxx" className="text-gray-500">
              {addrDetails || 'Tap to add details'}
            </CustomText>
          </View>
        </View>
        <CustomIcon icon={{ type: 'Ionicons', name: 'chevron-forward', size: 20 }} />
      </TouchableOpacity>

      {/* Leave at door */}
      <View className="flex-row items-center justify-between py-4">
        <View className="flex-row items-center">
          <CustomIcon icon={{ type: 'MaterialCommunityIcons', name: 'door-closed-lock', size: 32, color: '#AAC810' }} />
          <CustomText variant="body" fontSize="sm" fontWeight="semibold" className="ml-4">
            Leave order at the door
          </CustomText>
        </View>
        <Switch
          value={leaveAtDoor}
          onValueChange={(v: boolean) => {
            dispatch(toggleLeaveAtDoor(v));
          }}
          thumbColor={leaveAtDoor ? '#AAC810' : undefined}
          trackColor={{ false: '#ccc', true: '#AAC81055' }}
        />
      </View>

      {/* Send as gift */}
      <TouchableOpacity className="flex-row items-center justify-between py-4" onPress={() => dispatch(toggleSendAsGift(!sendAsGift))}>
        <View className="flex-row items-center">
          <CustomIcon icon={{ type: 'Feather', name: 'gift', size: 32, color: '#AAC810' }} />
          <CustomText variant="body" fontSize="sm" fontWeight="semibold" className="ml-4">
            Send as a gift
          </CustomText>
        </View>
        <CustomIcon icon={{ type: 'Ionicons', name: 'chevron-forward', size: 20 }} />
      </TouchableOpacity>

      {/* Courier instructions */}
      <View className="py-4">
        <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2">
          <TextInput
            className="text-body dark:text-white"
            placeholder="Instructions for the courier"
            placeholderTextColor="#999"
            multiline
            value={courierInstructions}
            onChangeText={(t) => {
              dispatch(setCourierInstructions(t));
            }}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        </View>
      </View>

      {/* Delivery time */}
      <CustomText variant="heading3" fontWeight="semibold" fontSize="lg" className="mt-6 mb-3">
        Delivery time
      </CustomText>
      {(['Standard', 'Schedule'] as const).map((opt) => {
        const sel = deliveryOption === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => dispatch(setDeliveryOption(opt))}
            className={`flex-row items-center p-4 mb-2 border rounded-lg ${sel ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}
          >
            <CustomIcon
              icon={{
                type: 'FontAwesome',
                name: sel ? 'check-circle' : 'circle-o',
                size: 22,
                color: sel ? '#AAC810' : '#AAA',
              }}
            />
            <View className="flex-1 px-4">
              <CustomText variant="body" fontSize="sm" fontWeight="semibold">
                {opt}
              </CustomText>
              <CustomText variant="label" fontSize="sxx" className="text-gray-500 dark:text-gray-400">
                {opt === 'Standard' ? `${deliveryTime} min` : 'Choose a delivery time'}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Payment method */}
      <CustomText variant="heading3" fontSize="lg" fontWeight="semibold" className="mt-6 mb-3">
        Payment
      </CustomText>
      {paymentMethods?.map((opt) => {
        const sel = paymentMethod === opt.name;

        if (!opt.isDetailsSubmitted) return <></>;

        return (
          <TouchableOpacity
            key={opt.name}
            onPress={() => dispatch(setPaymentMethod(opt.name as 'COD' | 'Stripe'))}
            className={`flex-row items-center p-4 mb-2 border rounded-lg ${sel ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}
          >
            <CustomIcon
              icon={{
                type: 'FontAwesome',
                name: sel ? 'check-circle' : 'circle-o',
                size: 22,
                color: sel ? '#AAC810' : '#AAA',
              }}
            />
            <View className="flex-1 px-4">
              <CustomText variant="body" fontSize="sm" fontWeight="semibold">
                {opt.name === 'COD' ? 'Cash on Delivery' : 'Stripe'}
              </CustomText>
              <CustomText variant="label" fontSize="sxx" className="text-gray-500 dark:text-gray-400">
                {opt.name === 'COD' ? 'Pay after delivery' : 'Pay using stripe'}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Coupon code */}
      <CustomText variant="heading3" fontSize="lg" fontWeight="semibold" className="mt-6 mb-3">
        Redeem code
      </CustomText>
      <View className="flex-row  items-center border border-gray-200 dark:border-gray-700 rounded-lg mb-3 px-4">
        <CustomIcon icon={{ type: 'MaterialCommunityIcons', name: 'ticket-percent', size: 20, color: '#AAC810' }} />
        <TextInput
          className="flex-1 py-4  ml-3 text-base text-black dark:text-white"
          placeholder="Enter gift card or promo code"
          placeholderTextColor="#999"
          value={couponCode}
          onChangeText={(t) => dispatch(setCouponCode(t))}
        />
      </View>
      <View className="d-flex flex-row items-center justify-end">
        <View style={{ paddingHorizontal: 8 }}>
          {validatingCoupon ? (
            <ActivityIndicator size={16} className="px-4 py-1.5 rounded-md bg-primary/70" />
          ) : checkout.couponDiscount > 0 ? (
            <CustomText className="text-primary font-semibold">✓ Applied</CustomText>
          ) : (
            <TouchableOpacity
              className="px-4 py-1.5 rounded-md bg-primary/70"
              onPress={() => validateCoupon({ variables: { coupon: couponCode } })}
              disabled={!couponCode}
            >
              <CustomText fontSize="xs">Apply</CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tip selector */}
      <CustomText variant="heading3" fontWeight="semibold" fontSize="lg" className="mb-3 mt-4">
        Add courier tip
      </CustomText>
      <CustomText variant="label" className="text-gray-500 dark:text-gray-400 mb-2">
        100% of the tip goes to your courier.
      </CustomText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        {TIP_OPTIONS.map((opt) => (
          <TipOption key={opt} amount={opt} isSelected={tip === opt} onPress={() => dispatch(setTip(opt))} />
        ))}

        {/* custom tip */}
        <TouchableOpacity
          onPress={() => setShowTipModal(true)}
          className={`
            flex-row items-center mr-3 px-5 py-2 rounded-full border
            ${isCustom ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-700'}
          `}
        >
          {isCustom ? (
            <>
              <CustomText variant="body" fontWeight="semibold" className="text-primary mr-3">
                {tip.toFixed(1)} €
              </CustomText>
              <CustomIcon icon={{ type: 'Feather', name: 'edit-2', size: 16 }} />
            </>
          ) : (
            <CustomIcon icon={{ type: 'Feather', name: 'edit-2', size: 18, color: '#999' }} />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Summary */}
      <CustomText variant="heading3" fontSize="lg" fontWeight="semibold" className="mb-1">
        Summary
      </CustomText>
      <CustomText variant="caption" className="text-gray-500 dark:text-gray-400 mb-4">
        Inc. VAT and service fees
      </CustomText>
      <View className="space-y-3 mb-6">
        {SUMMARY_ITEMS.map(({ label, value }) => (
          <View key={label} className="flex-row justify-between my-2">
            <CustomText variant="body" fontSize="sm">
              {label}
            </CustomText>
            <CustomText variant="body" fontSize="sm">
              {value}
            </CustomText>
          </View>
        ))}
      </View>

      {/* Tip Edit Modal */}
      <TipEditModal
        visible={showTipModal}
        min={0.5}
        max={100}
        initial={tip}
        onCancel={() => setShowTipModal(false)}
        onDone={(newTip) => {
          dispatch(setTip(newTip));
          setShowTipModal(false);
        }}
      />

      <LocationPickerModal visible={showLocationModal} onClose={() => setShowLocationModal(false)} onOpen={() => setShowLocationModal(true)} redirectTo={`${source}-order-checkout`} />
    </ScrollView>
  );
};
