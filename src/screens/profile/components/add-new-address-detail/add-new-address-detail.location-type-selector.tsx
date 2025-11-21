// ─────────────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────────────
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// 🔧 Icons
import { CustomIcon } from '@/components/common/Icon';
import { Ionicons } from '@expo/vector-icons';

// 🧠 Types
import { LocationTypeSelectorProps } from './interface';

// 🅰️ Custom Text
import { CustomText } from '@/components';

// ─────────────────────────────────────────────────────
// 🧩 Component: LocationTypeSelector
// ─────────────────────────────────────────────────────
const LocationTypeSelector: React.FC<LocationTypeSelectorProps> = ({ options, selected, onSelect, showDropdown, setShowDropdown }) => {
  return (
    <View className="bg-white dark:bg-dark-card relative rounded-xl border border-border dark:border-dark-grey/30">
      {/* ── Toggler (shows selected option and dropdown icon) */}
      {selected?.length > 1 && (
        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4" onPress={() => setShowDropdown(!showDropdown)}>
          <View className="flex-row items-center space-x-3">
            {selected ? <CustomIcon icon={options.find((o) => o.label === selected)?.icon} /> : null}
            <CustomText variant="body" fontSize="sm" className={`text-base ${selected ? 'ps-3' : ''}`}>
              {selected || 'Select location type'}
            </CustomText>
          </View>
          <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#A5C616" />
        </TouchableOpacity>
      )}

      {/* ── Dropdown list when toggled open and something is selected */}
      {selected?.length > 1 && showDropdown && (
        <View className="border-t rounded-md shadow-sm absolute border border-border dark:border-dark-grey/30 h-auto w-100 bg-white dark:bg-dark-card top-16 z-20 left-0 right-0">
          {options.map((option) => (
            <TouchableOpacity
              key={option.label}
              onPress={() => {
                onSelect(option.label);
                setShowDropdown(false);
              }}
              className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-dark-grey/30 dark:text-dark-text"
            >
              <CustomIcon icon={option.icon} />
              <CustomText fontSize="sm" variant="body" className="ps-3 dark:text-dark-text">
                {option.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Static list when nothing is selected yet */}
      {selected?.length < 1 && (
        <View className="border-t rounded-md shadow-sm border-gray-200 dark:border-gray-500 h-auto w-100 bg-background dark:bg-dark-background">
          {options.map((option) => (
            <TouchableOpacity
              key={option.label}
              onPress={() => {
                onSelect(option.label);
                setShowDropdown(false);
              }}
              className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-500"
            >
              <CustomIcon icon={option.icon} />
              <CustomText fontSize="sm" variant="body" className="ps-3 dark:text-white">
                {option.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default LocationTypeSelector;
