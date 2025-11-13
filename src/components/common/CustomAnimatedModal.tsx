// components/common/Modals/CustomAnimatedModal.tsx

import React, { useEffect, useRef } from 'react';
import { Modal, View, Animated } from 'react-native';
// interfaces
import { CustomAnimatedModalProps } from './interfaces';

const CustomAnimatedModal: React.FC<CustomAnimatedModalProps> = ({
  visible,
  onClose,
  children,
  containerClassName = 'w-9/12 rounded-2xl bg-white p-6 items-center',
  animationType = 'spring',
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animation =
        animationType === 'spring'
          ? Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
              speed: 15,
              bounciness: 10,
            })
          : Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            });

      animation.start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <View>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <Animated.View className={containerClassName} style={{ transform: [{ scale: scaleAnim }] }}>
            {children}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomAnimatedModal;
