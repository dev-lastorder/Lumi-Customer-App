// src/components/common/Modals/ConfirmationModal.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { CustomText } from '@/components/common/CustomText'; // Adjust path as needed
import type { RootState, AppDispatch } from '@/redux/store'; // Adjust path

import { CustomAnimatedModal } from '../common'; // Make sure this path is correct
import { clearCart, closeConfirmationModal, setQuantity, store, useAppSelector } from '@/redux';

// Props for the text content and other configurations
interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  containerClassName?: string; // Optional custom styling for the modal container
}

export function ConfirmationModal(props: ConfirmationModalProps) {
  const dispatch: AppDispatch = useDispatch();

  // Read visibility from cartSlice
  const isVisible = useAppSelector((state) => state.cart.isShowConfirmationModal);

  // Destructure text props
  const { title, message, confirmText, cancelText, containerClassName } = props;

  const handleOnConfirm = () => {
    console.log("Clearing cart and adding new item...");
    dispatch(clearCart());

    const pendingItem = store.getState().cart.pendingItem;

    if (pendingItem) {
      dispatch(setQuantity(pendingItem));
    }

    dispatch(closeConfirmationModal());
  };


  const handleOnCancel = () => {
    dispatch(closeConfirmationModal()); // Action from cartSlice
  };

  // If not visible, don't render anything.
  // CustomAnimatedModal also handles its internal visibility, but this is a good optimization.
  if (!isVisible) {
    return null;
  }

  return (
    <CustomAnimatedModal
      visible={isVisible}
      onClose={handleOnCancel} // Backdrop press or swipe should also trigger cancel
      containerClassName={containerClassName || 'w-11/12 max-w-md rounded-xl bg-background dark:bg-dark-background p-6 shadow-xl'}
      animationType="spring"
    >
      <View className="items-center">
        <CustomText variant="heading2" fontWeight="bold" className="text-text dark:text-dark-text mb-3 text-center" isDefaultColor={false}>
          {title} {/* Use prop */}
        </CustomText>
        <CustomText variant="body" className="text-text-secondary dark:text-dark-text-secondary mb-6 text-center" isDefaultColor={false}>
          {message} {/* Use prop */}
        </CustomText>

        <View className="flex-row w-full justify-around mt-2">
          <TouchableOpacity
            onPress={handleOnCancel}
            className="flex-1 bg-gray-200 dark:bg-dark-gray-600 py-3 px-4 rounded-lg mr-2 items-center"
            activeOpacity={0.7}
          >
            <CustomText variant="button" fontWeight="medium" className="text-text dark:text-text" isDefaultColor={false}>
              {cancelText} {/* Use prop */}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOnConfirm}
            className="flex-1 bg-primary dark:bg-dark-primary py-3 px-4 rounded-lg ml-2 items-center"
            activeOpacity={0.7}
          >
            <CustomText variant="button" fontWeight="semibold" className="text-button-text dark:text-dark-button-text" isDefaultColor={false}>
              {confirmText} {/* Use prop */}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </CustomAnimatedModal>
  );
}
