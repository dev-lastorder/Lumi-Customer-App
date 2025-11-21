import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';

interface MessageRowProps {
  comment: string | null;
  onPress: () => void;
}

export const AddMessageRow: React.FC<MessageRowProps> = ({ comment, onPress }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-4 pt-0 ">
    <View className="flex-row flex-1 items-center space-x-3 gap-4">
      <CustomIcon icon={{ type: 'Feather', name: 'message-square', size: 20 }} />
      <View className="flex-1">
        <CustomText variant="body" fontSize="sm" fontWeight="semibold">
          {comment ? 'Comment for restaurant' : 'Add a message for the restaurant'}
        </CustomText>

        {comment ? (
          <CustomText variant="label" fontSize="xs" className="text-gray-500 dark:text-gray-400">
            {comment}
          </CustomText>
        ) : (
          <CustomText variant="label" fontSize="xs" className="text-gray-500 dark:text-gray-400">
            Special requests, allergies, dietary restrictions?
          </CustomText>
        )}
      </View>
    </View>
    <CustomIcon icon={{ type: 'Feather', name: 'chevron-right', size: 20 }} />
  </TouchableOpacity>
);
