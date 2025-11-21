import { CustomText } from '@/components';
import React from 'react';
import { View } from 'react-native';
// Define the types for the SectionHeader component's props
interface SectionHeaderProps {
  title: string;
  rightComponent?: React.ReactNode; // React.ReactNode allows any valid JSX element to be passed
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, rightComponent }) => {
  return (
    <View className="flex-row justify-between items-center px-4">
      <CustomText variant="subheading" fontWeight="semibold">
        {title}
      </CustomText>
      {rightComponent && rightComponent}
    </View>
  );
};

export default SectionHeader;
