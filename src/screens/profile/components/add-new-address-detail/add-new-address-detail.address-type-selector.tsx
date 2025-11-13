// ─────────────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 🔧 Components
import { CustomIcon } from '@/components/common/Icon';

// 🧠 Types
import { AddressTypeSelectorProps } from './interface';

// ─────────────────────────────────────────────────────
// 🧩 Component: AddressTypeSelector
// ─────────────────────────────────────────────────────
const AddressTypeSelector: React.FC<AddressTypeSelectorProps> = ({ options, selected, onSelect }) => {
  return (
    <View className="flex-row justify-between mt-2">
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          onPress={() => onSelect(option.label)}
          className={`flex-1 items-center justify-center border rounded-xl py-4 mx-1 ${
            selected === option.label ? 'bg-primary/10 border-primary' : 'border-gray-300'
          }`}
        >
          {/* Icon */}
          <CustomIcon icon={option.icon} />

          {/* Label */}
          <Text className={`mt-2 ${selected === option.label ? 'text-primary font-semibold' : ''}`}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AddressTypeSelector;
