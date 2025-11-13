import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';

interface AddCutleryRowProps {
  onPress: () => void;
}
export const AddCutleryRow: React.FC<AddCutleryRowProps> = ({ onPress }) => {
  return (
    <View className="py-4">
      <TouchableOpacity onPress={() => onPress()} className="flex-row items-center  rounded-lg py-3 gap-3">
        <View className="flex-row items-center bg-primary/10 rounded-md px-7 py-4 justify-center">
          <CustomIcon icon={{ type: 'Feather', name: 'plus', size: 20, color: '#AAC810' }} />
        </View>
        <View className="ml-3 flex-1">
          <CustomText variant="body" fontWeight="semibold" fontSize="sm" lightColor="#AAC810" darkColor="#AAC810">
            Add cutlery
            <CustomText variant="caption" fontWeight="normal" fontSize="sm" className="text-gray-500">
              {' '}
              (+ 0,00 €)
            </CustomText>
          </CustomText>
          <CustomText variant="caption" fontSize="xs" className="text-gray-500">
            Let’s reduce waste – request cutlery only if you really need them.
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};
