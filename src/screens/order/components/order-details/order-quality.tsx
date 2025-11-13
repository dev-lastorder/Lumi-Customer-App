import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';
import { useDispatch } from 'react-redux';

export default function OrderQuantity({
  quantity,
  editing,
  onChange,
  onCloseEditing = () => {}, // ← new prop
}: {
  quantity: number;
  editing: boolean;
  onChange: (q: string) => void;
  onCloseEditing?: () => void; // ← new
}) {

  const dispatch = useDispatch();
  const [displayQty, setDisplayQty] = useState(quantity);
  const [prevQty, setPrevQty] = useState<number | null>(null);

  // animation for previous qty
  const animY = useSharedValue(0);
  const animOpacity = useSharedValue(0);

  // bump animation
  useEffect(() => {
    if (quantity !== displayQty) {
      setPrevQty(displayQty);
      animY.value = 0;
      animOpacity.value = 1;
      animY.value = withTiming(-10, { duration: 500 });
      animOpacity.value = withTiming(0, { duration: 500 });
      setDisplayQty(quantity);
    }
  }, [quantity]);

  const prevStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animY.value }],
    opacity: animOpacity.value,
  }));

  // ─── NEW: auto-close timer ───────────────────────────────
  useEffect(() => {
    if (editing) {
      const timer = setTimeout(() => {
        onCloseEditing();
      }, 3000); // 3s of inactivity
      return () => clearTimeout(timer);
    }
  }, [editing, onCloseEditing]);
  // ──────────────────────────────────────────────────────────

  if (!editing) {
    return (
      <View className="px-[1.6rem] py-2 border border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center">
        <CustomText variant="body" fontWeight="normal" fontSize="sm">
          {quantity}
        </CustomText>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3 bg-primary/10 rounded-lg px-2 py-.5 my-.5">
      <TouchableOpacity onPress={() => onChange('dec')} className="p-2 bg-white dark:bg-black rounded-full">
        <CustomIcon icon={{ type: 'Ionicons', name: 'remove', size: 20, color: '#AAC810' }} />
      </TouchableOpacity>

      <View className="w-12 h-12 items-center justify-center relative">
        {prevQty !== null && (
          <Animated.View style={[{ position: 'absolute' }, prevStyle]}>
            <CustomText variant="body" fontWeight="semibold" lightColor="#AAC810" darkColor="#AAC810">
              {prevQty}
            </CustomText>
          </Animated.View>
        )}
        <CustomText variant="body" fontWeight="semibold" lightColor="#AAC810" darkColor="#AAC810">
          {displayQty}
        </CustomText>
      </View>

      <TouchableOpacity onPress={() => onChange('inc')} className="p-2 bg-white dark:bg-black rounded-full">
        <CustomIcon icon={{ type: 'Ionicons', name: 'add', size: 20, color: '#AAC810' }} />
      </TouchableOpacity>
    </View>
  );
}
