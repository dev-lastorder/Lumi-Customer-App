// src/components/checkout/PickupForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState, setCouponCode, setDeliveryOption, setPaymentMethod } from '@/redux';

type SummaryItem = {
  label: string;
  value: string;
};
type PickupFormProps = {
  tax: number;
  validateCoupon: (opts: { variables: { coupon: string } }) => void;
  validatingCoupon: boolean;
  paymentMethods?: { id: number; name: string; isDetailsSubmitted: boolean }[];
};

export const PickupForm: React.FC<PickupFormProps> = ({ paymentMethods, tax, validateCoupon, validatingCoupon }) => {
  // --- form state ---
  const dispatch = useDispatch();

  // ─── pull current checkout state ────────────────────────────
  const { /* deliveryOption,  */ paymentMethod, couponCode } = useSelector((s: RootState) => s.cart.checkout);

  // ─── local copies for input controls ────────────────────────
  const couponTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── summary ───────────────────────────────
  const { totalPrice, checkout, items } = useSelector((s: RootState) => s.cart);
  let itemTotal = 0;
  Object.values(items).forEach((cartItem) => {
    itemTotal += cartItem.unitPrice * cartItem.quantity;
  });
  const discountAmount = checkout.couponDiscount > 0 ? ((checkout.couponDiscount || 0) / 100) * itemTotal : 0;
  const tipAmount = checkout.tip;
  const total = itemTotal + tax /* + deliveryCharges  */ - discountAmount + tipAmount;

  const SUMMARY_ITEMS = [
    { label: 'Item subtotal', value: `${totalPrice.toFixed(2)} €` },
    { label: 'Tax', value: `${tax.toFixed(2)} €` },
    // { label: 'Delivery fee', value: `${deliveryCharges.toFixed(2)} €` },
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
    <View className="px-4 mt-8 space-y-4">
      {/* ── Delivery time toggle ───────────────────────────────────── */}
      {/* <CustomText variant="heading3" fontWeight="semibold" fontSize="lg" className="mt-6 mb-3">
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
                {opt === 'Standard' ? 'Currently unavailable' : 'Choose a delivery time'}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      })} */}

      {/* ── Payment method ────────────────────────────────────────── */}
      <CustomText variant="heading3" fontSize="lg" fontWeight="semibold" className="mt-6 mb-3">
        Payment
      </CustomText>
      {paymentMethods?.map((opt, index) => {
        const sel = paymentMethod === opt.name;

        if(!opt.isDetailsSubmitted) return <></>

        return (
          <TouchableOpacity
            key={opt.name+index.toString()}
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

      {/* ── Coupon code ────────────────────────────────────────────── */}
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

      {/* ── Summary ───────────────────────────────────────────────── */}
      <CustomText variant="heading3" fontSize="lg" fontWeight="semibold" className="mb-1">
        Summary
      </CustomText>
      <CustomText variant="caption" className="text-gray-500 dark:text-gray-400 mb-4">
        Inc. VAT and service fees
      </CustomText>
      <View className="space-y-3 mb-6">
        {SUMMARY_ITEMS.map(({ label, value }, index) => (
          <View key={index} className="flex-row justify-between my-2">
            <CustomText variant="body" fontSize="sm">
              {label}
            </CustomText>
            <CustomText variant="body" fontSize="sm">
              {value}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};
