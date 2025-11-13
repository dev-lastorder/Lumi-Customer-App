// src/components/checkout/TipEditModal.tsx
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import { CustomText, InputWithLabel } from '@/components';

interface TipEditModalProps {
  visible: boolean;
  min: number;
  max: number;
  initial?: number;
  onCancel: () => void;
  onDone: (value: number) => void;
}

const PRIMARY = '#AAC810';

export const TipEditModal: React.FC<TipEditModalProps> = ({ visible, min, max, initial = min, onCancel, onDone }) => {
  const [raw, setRaw] = useState(initial.toFixed(2));
  const { dark } = useTheme();

  useEffect(() => {
    if (visible) setRaw(initial.toFixed(2));
  }, [visible, initial]);

  const num = parseFloat(raw.replace(',', '.'));
  const valid = !isNaN(num) && num >= min && num <= max;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      useNativeDriver
      style={{ margin: 'auto', justifyContent: 'center', alignItems: 'center', width: '85%' }}
    >
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} className="w-11/12">
        <View
          className={`
            bg-card dark:bg-dark-card 
            rounded-lg 
            p-6
          `}
        >
          {/* Title */}
          <CustomText variant="heading2" fontWeight="semibold" fontSize="xl" className="text-black dark:text-white text-xl mb-2">
            Enter tip amount
          </CustomText>

          {/* Subtitle */}
          <CustomText fontSize="md" variant="body" className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            You can tip between <CustomText className="font-semibold text-gray-800 dark:text-gray-100">{min.toFixed(2)} €</CustomText>–
            {max.toFixed(2)} €.
          </CustomText>

          {/* InputWithLabel */}
          <InputWithLabel
            label="Tip amount"
            value={raw}
            onChangeText={setRaw}
            keyboardType="decimal-pad"
            maxLength={7}
            // placeholderTextColor={dark ? '#aaa' : '#666'}
            iconName={undefined} // no icon on the left
            iconPosition="right" // if you ever want one, it'll sit on the right
            errorMessage={valid ? '' : `Must be between ${min}–${max}`}
            showErrorMessage={!valid}
            // Tailwind wrapper overrides:
            // phoneInputStyles={undefined}
            // modalStyles={undefined}
            // theme={undefined}
            className="mb-2"
          />

          {/* Buttons */}
          <View className="d-flex flex-row justify-end mt-5 w-full">
            <TouchableOpacity onPress={onCancel} className=" px-12  py-3 rounded bg-primary/10">
              <CustomText variant="button" fontWeight="normal" fontSize="sm" className="text-base" style={{ color: PRIMARY }}>
                Cancel
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => valid && onDone(num)}
              disabled={!valid}
              className={`
                ml-3 px-12  py-3 rounded 
                ${valid ? 'bg-[#AAC810]' : 'bg-[#AAC810]/50'}
              `}
            >
              <CustomText variant="button" fontWeight="normal" fontSize="sm" className="text-base text-white">
                Done
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
