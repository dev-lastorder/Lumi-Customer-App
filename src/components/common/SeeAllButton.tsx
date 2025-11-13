import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CustomText } from '@/components/common/CustomText';

interface SeeAllButtonProps {
  onPress: () => void;
}

const SeeAllButton: React.FC<SeeAllButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-icon-background dark:bg-dark-icon-background px-3.5 py-1.5 rounded-2xl" activeOpacity={0.7}>
      <CustomText fontSize="sm" fontWeight="normal">
        See all
      </CustomText>
    </TouchableOpacity>
  );
};

export default SeeAllButton;
