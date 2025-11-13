// src/components/Order/MessageModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import CustomBottomSheetModal from '@/components/common/BottomModalSheet/CustomBottomSheetModal';
import { CustomText } from '@/components/common/CustomText';
import { CustomIcon } from '@/components/common/Icon';

interface MessageModalProps {
  visible: boolean;
  initialComment?: string;
  onClose: () => void;
  onSave: (comment: string) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ visible, initialComment = '', onClose, onSave }) => {
  const [text, setText] = useState(initialComment);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Small delay to ensure the modal animation is complete and the input is ready
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleDone = () => {
    onSave(text.trim());
    onClose();
  };

  const handleClear = () => {
    setText('');
  };

  const maxChars = 400;

  return (
    <CustomBottomSheetModal
      visible={visible}
      onClose={onClose}
      isShowHeader={true}
      headerTitle="Add message"
      headerButton={
        <TouchableOpacity onPress={handleDone} className="px-8 py-3 bg-primary/10 rounded-md">
          <CustomText variant="label" fontWeight="medium" lightColor="#AAC810" darkColor="#AAC810">
            Done
          </CustomText>
        </TouchableOpacity>
      }
      isShowCloseButton={false}
    >
      <View className="p-4">
        {/* Explanation */}
        <CustomText variant="body" fontWeight="semibold" fontSize='sm'>
          Special requests, allergies, dietary restrictions?
        </CustomText>
        <CustomText
          variant="caption"
          fontWeight="normal"
          fontSize='xs'
          darkColor='#9CA3AF'
        >
          Please note that your message to the store may also be seen by the courier partner delivering your order 😊
        </CustomText>

        {/* Text input with clear button */}
        <View className="relative mt-6">
          <TextInput
            ref={textInputRef}
            value={text}
            onChangeText={(t) => {
              if (t.length <= maxChars) setText(t);
            }}
            placeholder=""
            placeholderTextColor="#9CA3AF"
            multiline
            className="border placeholder:text-sm border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 h-24 text-base text-black dark:text-white"
          />
          {text.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="absolute right-3 top-3">
              <CustomIcon icon={{ type: 'Feather', name: 'x', size: 18, color: '#6B7280' }} />
            </TouchableOpacity>
          )}
        </View>

        {/* Character count */}
        <View className="items-end mt-2">
          <CustomText variant="label" fontWeight="normal" className="text-gray-500 dark:text-gray-400" fontSize='xs'>
            {text.length}/{maxChars}
          </CustomText>
        </View>

        {/* Header row with Done */}
        {/* <View className="flex-row justify-end my-4">
          <TouchableOpacity onPress={handleDone} className="px-8 py-3 bg-primary/10 rounded-md">
            <CustomText variant="label" fontWeight="medium" lightColor="#AAC810" darkColor="#AAC810">
              Done
            </CustomText>
          </TouchableOpacity>
        </View> */}
      </View>
    </CustomBottomSheetModal >
  );
};
