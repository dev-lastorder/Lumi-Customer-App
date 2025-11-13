import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatHeaderProps {
  riderName: string;
  riderId?: string;
  onClose: () => void;
}
 const ChatHeader: React.FC<ChatHeaderProps> = ({ riderName, riderId, onClose }) => {
  return (
    <View className="flex-row items-center px-4 pt-5 pb-4 border-b border-gray-200">
      <TouchableOpacity onPress={onClose} className="p-2 mr-2">
        <Ionicons name="chevron-down" size={24} color="#666" />
      </TouchableOpacity>
      <View className="flex-1 items-center mr-8">
        <Text className="text-base font-semibold text-black">{riderName}</Text>
        <Text className="text-sm text-gray-600">
          {riderId ? 'Online' : 'Courier Partner'}
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader