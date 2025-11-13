// src/components/zone/ZoneConfirmModal.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '@/components/common/CustomText';
import { CustomAnimatedModal } from '@/components';

interface ZoneConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  zoneTitle: string;
}

export default function ZoneConfirmModal({ visible, onClose, onConfirm, zoneTitle }: ZoneConfirmModalProps) {
  return (
    <CustomAnimatedModal containerClassName="bg-background dark:bg-dark-background rounded-md p-4 mx-5" visible={visible} onClose={onClose}>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <CustomText variant="heading3" fontWeight="bold" className="text-black text-center mb-2">
          Confirm Zone Selection
        </CustomText>
        <CustomText variant="body" fontWeight="normal" fontSize="sm" className="text-gray-600 mb-4 text-center p-2">
          You have selected the zone:{' '}
          <CustomText fontWeight="semibold" className="font-semibold">
            {zoneTitle}
          </CustomText>
          . Please confirm to proceed.
        </CustomText>
      </View>

      <View className="flex-row items-center justify-center gap-3">
        <TouchableOpacity className="bg-gray-200 dark:bg-slate-600 w-5/12 rounded-md px-4 py-3" onPress={onClose}>
          <CustomText variant="button" fontSize="sm" fontWeight="normal" className="text-black">
            Cancel
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity className="bg-primary w-6/12 rounded-md px-4 py-3" onPress={onConfirm}>
          <CustomText variant="button" fontWeight="normal" fontSize="sm" className="text-white">
            Confirm
          </CustomText>
        </TouchableOpacity>
      </View>
    </CustomAnimatedModal>
  );
}

const styles = StyleSheet.create({
  // no custom styles needed here
});
