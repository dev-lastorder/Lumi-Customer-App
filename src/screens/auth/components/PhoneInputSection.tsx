// src/components/auth/PhoneInputSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';

interface PhoneInputSectionProps {
  phone: string;
  country: ICountry | undefined;
  onChangePhone: (phone: string) => void;
  onChangeCountry: (country: ICountry) => void;
  error?: string;
  className?: string;
  instructionText?: string;
  confirmText?: string;
}

export const PhoneInputSection: React.FC<PhoneInputSectionProps> = ({
  phone,
  country,
  onChangePhone,
  onChangeCountry,
  error,
  className = '',
  instructionText = "Sign in easily by your phone number !",
  confirmText = "A code will be sent to your number",
}) => {
  return (
    <View className={`mb-6 ${className}`}>
      {/* Instruction Text */}
      <Text className="text-lg font-medium text-gray-800 mb-6">
        {instructionText}
      </Text>
      
      {/* Phone Input */}
      <View className="mb-4">
        <PhoneInput
          defaultCountry="QA"
          selectedCountry={country}
          onChangeSelectedCountry={onChangeCountry}
          onChangePhoneNumber={onChangePhone}
          value={phone}
          placeholder="2409 3560"
          theme="light"
        //   containerStyle={{
        //     backgroundColor: 'transparent',
        //     borderRadius: 12,
        //     borderWidth: 1,
        //     borderColor: '#E5E7EB',
        //     paddingHorizontal: 16,
        //     paddingVertical: 12,
        //     marginBottom: 8,
        //   }}
        //   textStyle={{
        //     fontSize: 16,
        //     color: '#1F2937',
        //   }}
        //   flagButtonStyle={{
        //     backgroundColor: '#F3F4F6',
        //     borderRadius: 8,
        //     paddingHorizontal: 12,
        //     marginRight: 12,
        //   }}
        />
        
        {/* Error Message */}
        {error && (
          <Text className="text-red-500 text-sm mt-1">
            {error}
          </Text>
        )}
      </View>
      
      {/* Confirmation Text */}
      <Text className="text-sm mb-6" style={{ color: '#969696' }}>
        {confirmText}
      </Text>
    </View>
  );
};

export default PhoneInputSection;