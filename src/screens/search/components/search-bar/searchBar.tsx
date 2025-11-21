// Cores
import React, { useEffect, useRef } from 'react';
import { View, TextInput, Pressable, TouchableOpacity, Animated, Platform } from 'react-native';
// Interfaces
import { Props } from './interface';
// Components
import { CustomIcon } from '@/components';
// Hooks
import { useThemeColor } from '@/hooks';
import { commonColors } from '@/utils/constants/Colors';
import adjust from '@/utils/helpers/adjust';

const AnimatedIconWrapper = ({ children }: { children: React.ReactNode }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return <Animated.View style={{ opacity, transform: [{ scale }] }}>{children}</Animated.View>;
};

const SearchBar: React.FC<Props> = ({ search, handleOnBlur, handleOnChange, handleClearField, isFocus, setIsFocus, inputRef }) => {
  const { bgLight, text } = useThemeColor();
  const grey = commonColors.grey;
  const darkGrey = commonColors.darkGrey;
  return (
    <View className="flex-row items-center rounded-full px-5 gap-2" style={{ backgroundColor: bgLight, paddingVertical: Platform.OS == 'ios' ? adjust(8) : adjust(0) }}>
      {!isFocus ? (
        <AnimatedIconWrapper>
          <CustomIcon icon={{ size: adjust(22), type: 'Ionicons', name: 'search-sharp', color: grey }} />
        </AnimatedIconWrapper>
      ) : (
        <Pressable onPress={handleOnBlur}>
          <AnimatedIconWrapper>
            <CustomIcon icon={{ size: adjust(22), type: 'Entypo', name: 'chevron-left', color: text }} />
          </AnimatedIconWrapper>
        </Pressable>
      )}

      <TextInput
        ref={inputRef}
        className="flex-1 text-base pl-1"
        style={{ color: text }}
        placeholder="Search restaurants, stores, items"
        placeholderTextColor={grey}
        value={search}
        onChangeText={handleOnChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />

      {search !== '' && (
        <TouchableOpacity onPress={handleClearField}>
          <AnimatedIconWrapper>
            <CustomIcon icon={{ size: 18, type: 'Entypo', name: 'circle-with-cross', color: darkGrey }} />
          </AnimatedIconWrapper>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
