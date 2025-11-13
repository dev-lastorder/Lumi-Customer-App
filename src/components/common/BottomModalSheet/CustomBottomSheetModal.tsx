import React, { useRef, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Text,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '@/components/common/Icon';
import type { DimensionValue, Animated as RNAnimated } from 'react-native';

interface CustomBottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: DimensionValue;
  containerStyle?: ViewStyle;
  isShowHeader?: boolean;
  headerTitle?: string;
  animatedHeader?: boolean;
  isShowCloseButton?: boolean;
  headerButton?: React.ReactNode;
}

const CustomBottomSheetModal: React.FC<CustomBottomSheetModalProps> = ({
  visible,
  onClose,
  children,
  maxHeight = '80%',
  containerStyle,
  isShowHeader = true,
  headerTitle = 'Modal',
  isShowCloseButton = true,
  headerButton,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const isScrolling = useRef(false);

  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      return gestureState.dy > 10;
    },
    onPanResponderGrant: () => {
      translateY.setOffset(translateY._value);
      translateY.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      translateY.flattenOffset();
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      translateY.flattenOffset();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* This TouchableOpacity will fill the space above the modal content */}
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1 }} />

        <Animated.View
          {...panResponder.panHandlers}
          className="bg-card dark:bg-dark-card rounded-t-3xl shadow-lg"
          style={[
            {
              maxHeight: maxHeight,
              paddingBottom: insets.bottom,
              transform: [{ translateY: translateY }],
            },
            containerStyle,
          ]}
        >
          {/* Drag Handle */}
          <View className="items-center py-3 z-50">
            <View className="h-1.5 w-12 bg-gray-300 dark:bg-dark-background rounded-full" />
          </View>

          {/* Header */}
          {isShowHeader && (
            <View className="flex-row  justify-between items-center px-5 pb-4 mt-4">
              <Text className="text-2xl font-bold text-black dark:text-white">{headerTitle}</Text>
              <View>
                {headerButton && <View className="ml-2">{headerButton}</View>}
                {isShowCloseButton && <TouchableOpacity onPress={onClose}>
                  <CustomIcon icon={{ type: 'Feather', name: 'x', size: 24 }} />
                </TouchableOpacity>}
              </View>
            </View>
          )}
          <>
            {children}
          </>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomBottomSheetModal;
