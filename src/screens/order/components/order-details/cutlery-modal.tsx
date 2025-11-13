// src/components/modals/CutleryModal.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Image, LayoutAnimation } from 'react-native';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import OrderQuantity from './order-quality';
// import OrderQuantity from './OrderQuantity';

const OPTIONS = [
  { key: 'chopsticks', label: 'Chopsticks', price: 0.1 },
  { key: 'fork', label: 'Fork', price: 0.1 },
  { key: 'spoon', label: 'Spoon', price: 0.1 },
];

interface CutleryModalProps {
  visible: boolean;
  onClose: () => void;
  maxQty?: number;
}

export default function CutleryModal({ visible, onClose, maxQty = 10 }: CutleryModalProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [editing, setEditing] = useState(false);
  const qtyTimeout = useRef<NodeJS.Timeout>();

  // animate qty change
  const onQtyChange = (newQty: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQty(newQty);
    setEditing(true);
    clearTimeout(qtyTimeout.current);
    qtyTimeout.current = setTimeout(() => setEditing(false), 2000);
  };

  // compute total price
  const price = selectedKeys.reduce((sum, key) => {
    const item = OPTIONS.find((o) => o.key === key);
    return sum + (item?.price || 0) * qty;
  }, 0);

  // toggle selection up to maxQty
  const toggleOption = (key: string) => {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length < maxQty) return [...prev, key];
      return prev;
    });
  };

  return (
    <CustomBottomSheetModal visible={visible} onClose={onClose} isShowHeader={false} maxHeight="90%">
      <View className="relative">
        {/* Close chevron */}
        <TouchableOpacity onPress={onClose} className="absolute top-0 z-50 right-4 p-2 bg-white/10 dark:bg-black/80 rounded-full shadow">
          <CustomIcon icon={{ type: 'Feather', name: 'chevron-down', size: 24 }} />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable body */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="-mt-8 rounded-t-xl" showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View className="-mt-7 h-72 bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden">
          <Image source={require('@/assets/images/burger.png')} className="w-full h-full object-cover" />
        </View>
        {/* Title */}
        <View className="px-4 py-4 sticky bg-white dark:bg-dark-background ">
          <CustomText variant="heading3" fontWeight="bold">
            Do you need cutlery?
          </CustomText>
        </View>
        {/* Subtitle & price */}
        <View className="px-4 mt-4 flex-row justify-between items-center">
          <CustomText variant="label" fontWeight="normal" className="text-gray-500">
            1 max per order
          </CustomText>
          <View className="flex-row items-center">
            <CustomText variant="body" fontWeight="semibold" className="text-primary">
              €{price.toFixed(2)}
            </CustomText>
            <TouchableOpacity className="ml-4">
              <CustomIcon icon={{ type: 'Feather', name: 'share-2', size: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity className="ml-2">
              <CustomIcon icon={{ type: 'Feather', name: 'info', size: 20 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 mt-2">
          <CustomText variant="body" fontWeight="normal">
            The restaurant will add it, if available
          </CustomText>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

        {/* Type section */}
        <View className="px-4">
          <CustomText variant="heading3" fontWeight="semibold">
            Type
          </CustomText>
          <CustomText variant="label" fontWeight="normal" className="text-gray-500 mb-2">
            Choose up to {maxQty} items
          </CustomText>

          {OPTIONS.map((opt) => {
            const isSel = selectedKeys.includes(opt.key);
            return (
              <TouchableOpacity key={opt.key} onPress={() => toggleOption(opt.key)} className="flex-row justify-between items-center py-3">
                <View className="flex-row items-center">
                  <CustomIcon
                    icon={{
                      type: 'FontAwesome',
                      name: isSel ? 'check-circle' : 'circle-o',
                      size: 24,
                      color: isSel ? '#AAC810' : '#AAA',
                    }}
                  />
                  <CustomText variant="body" fontWeight="normal" className="ml-3">
                    {opt.label}
                  </CustomText>
                </View>
                <CustomText variant="body" fontWeight="normal" className="text-gray-500">
                  +€{opt.price.toFixed(2)}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Divider */}
        {/* <View className="h-px bg-gray-200 dark:bg-gray-700 my-4" /> */}

        {/* Product info & Report */}
        <View className="px-4 pt-4">
          {['Product info', 'Report'].map((label) => (
            <TouchableOpacity key={label} className="flex-row justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
              <CustomText variant="body" fontWeight="normal">
                {label}
              </CustomText>
              <CustomIcon icon={{ type: 'Feather', name: 'chevron-right', size: 20 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Sticky footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-background border-t border-gray-200 dark:border-gray-700 px-4 pt-3 pb-10 flex-row items-center">
        <OrderQuantity quantity={qty} editing={true} onChange={onQtyChange} />
        <TouchableOpacity
          onPress={() => {
            onClose();
          }}
          className="flex-1 ml-4 h-12 bg-primary rounded-lg items-center justify-center"
        >
          <CustomText variant="button" fontWeight="normal" lightColor="white" darkColor="white">
            Add to order — €{price.toFixed(2)}
          </CustomText>
        </TouchableOpacity>
      </View>
    </CustomBottomSheetModal>
  );
}
