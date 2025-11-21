import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CustomText } from '@/components';

type InfoItemProps = {
  iconName: keyof typeof Feather.glyphMap;
  text: string;
};

const InfoItem: React.FC<InfoItemProps> = ({ iconName, text }) => {
  return (
    <View className="flex-row items-center space-x-1.5">
      <Feather name={iconName} size={14} className="text-text dark:text-dark-text" />
      <CustomText fontSize="sm" className="text-text dark:text-dark-text" isDefaultColor={false}>
        {text}
      </CustomText>
    </View>
  );
};

export default React.memo(InfoItem);
