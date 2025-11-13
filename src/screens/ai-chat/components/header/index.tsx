import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const index = ({ leftButtonHandler, rightButtonHandler, title }: { leftButtonHandler: () => void; rightButtonHandler: () => void, title: string }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-4 flex-row items-center justify-between">
      <TouchableOpacity onPress={() => leftButtonHandler()} className="w-10 h-10 rounded-full bg-white items-center justify-center">
        <Ionicons name="arrow-back" size={18} color="#1F2937" />
      </TouchableOpacity>

      <Text className="text-xl font-bold text-gray-900 flex-1 text-center">{title}</Text>

      <TouchableOpacity onPress={() => rightButtonHandler()} className="w-10 h-10 rounded-full bg-white items-center justify-center">
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#1F2937" />
      </TouchableOpacity>
    </View>
  );
};

export default index;
