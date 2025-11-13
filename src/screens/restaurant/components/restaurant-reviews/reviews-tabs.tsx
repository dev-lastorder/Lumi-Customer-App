// ──────────────────────────────────────────────
// 📦 Imports
// ──────────────────────────────────────────────
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// 🔧 Components
import { CustomText } from '@/components';

// 🧠 Types
interface Props {
  activeTab: 'newest' | 'highest' | 'lowest';
  setActiveTab: (tab: 'newest' | 'highest' | 'lowest') => void;
}

// ──────────────────────────────────────────────
// 🧩 Component: RatingTabs
// ──────────────────────────────────────────────
const RatingTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'newest', label: 'Newest' },
    { key: 'highest', label: 'Highest Rating' },
    { key: 'lowest', label: 'Lowest Rating' },
  ];

  return (
    <View className="flex-row justify-around mb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            <CustomText variant="label" fontWeight="medium" fontSize="xs" className={`${isActive ? 'text-white' : 'text-black dark:text-white'}`}>
              {tab.label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RatingTabs;
