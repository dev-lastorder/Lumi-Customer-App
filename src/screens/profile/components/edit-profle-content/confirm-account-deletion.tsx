//Components
import { CustomText } from '@/components';

// Hooks
import { useThemeColor } from '@/hooks';

// Interfaces
import { IDeleteAccountModalProps } from '@/utils';

// React Native
import { Modal, Pressable, View } from 'react-native';

export default function DeleteAccountModal({ visible, onClose, onConfirm }: IDeleteAccountModalProps) {
  // Hooks
  const appTheme = useThemeColor();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center dark:bg-white/80 bg-black/30">
        <View className="w-[95%] bg-white dark:bg-neutral-900 rounded-2xl p-6" style={{ backgroundColor: appTheme.card }}>
          <CustomText className="text-lg font-semibold text-center mb-4 text-red-500">Are you sure?</CustomText>
          <CustomText className="text-base text-center text-gray-500 mb-6">
            This action will delete your account permanently. Are you sure to delete your account?
          </CustomText>

          <View className="flex-row justify-between items-center w-full gap-2">
            <Pressable className="w-[50%] bg-gray-200 dark:bg-gray-700 rounded-xl py-3 items-center" onPress={onClose}>
              <CustomText className="text-gray-800 dark:text-gray-200 font-medium">Cancel</CustomText>
            </Pressable>

            <Pressable className="w-[50%] bg-red-500 rounded-xl py-3 items-center" onPress={onConfirm}>
              <CustomText className="text-white font-semibold" style={{ color: "white" }}>Delete</CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
