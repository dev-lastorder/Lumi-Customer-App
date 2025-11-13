import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { CustomIcon, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { IProps } from './interface';
import adjust from '@/utils/helpers/adjust';

// Animations
const useFadeInScale = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { animatedStyle: { opacity, transform: [{ scale }] } };
};

const AnimatedRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { animatedStyle } = useFadeInScale();
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// UI Component
const SearchHistory: React.FC<IProps> = ({ searches, setSearch, delSearchHistory }) => {
  const { primary } = useThemeColor();

  return (
    <View>
      <Header onClear={delSearchHistory} highlightColor={primary} />
      <HistoryList items={searches} onSelect={setSearch} />
    </View>
  );
};

export default SearchHistory;

// Subcomponents

const Header = ({ onClear, highlightColor }: { onClear: () => void; highlightColor: string }) => (
  <View className="border-b-[0.2px] border-gray-400">
    <View className="flex-row justify-between py-6 px-4">
      <CustomText variant='label' fontWeight="semibold">Recent searches</CustomText>
      <TouchableOpacity onPress={onClear}>
        <CustomText variant='label' fontWeight="semibold" fontFamily='Inter' isDefaultColor={false} className='text-primary' >
          Clear
        </CustomText>
      </TouchableOpacity>
    </View>
  </View>
);

const HistoryList = ({ items, onSelect }: { items: string[]; onSelect: (value: string) => void }) => (
  <View className="px-4">
    {items.map((item, index) => (
      <AnimatedRow key={index}>
        <TouchableOpacity
          onPress={() => onSelect(item)}
          className="flex-row items-center gap-4 py-6 border-b-[0.2px] border-gray-400"
        >
          <CustomIcon icon={{ size: adjust(24), name: 'clock', type: 'Feather' }} />
          <CustomText variant='body' fontWeight="medium">{item}</CustomText>
        </TouchableOpacity>
      </AnimatedRow>
    ))}
  </View>
);
