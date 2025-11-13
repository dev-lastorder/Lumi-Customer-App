import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from './CustomText';
import adjust from '@/utils/helpers/adjust';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll, showSeeAll = true }) => {
  return (
    <View className="flex flex-row items-center justify-between" style={{ paddingHorizontal: adjust(16) }}>
      <View className="flex-row items-center flex-1 flex-shrink min-w-0 pr-2">
        <CustomText fontSize="md" fontWeight="semibold" numberOfLines={1} className="flex-shrink">
          {title}
        </CustomText>
      </View>

      {showSeeAll && onSeeAll && (
        <View className="flex-shrink-0">
          <TouchableOpacity onPress={onSeeAll} className="bg-bgLight dark:bg-dark-bgLight px-3 py-1 rounded-xl">
            <CustomText fontSize="xs" fontWeight="medium">
              See All
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
