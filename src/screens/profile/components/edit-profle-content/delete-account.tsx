import { DELETE_USER } from '@/api';
import { CustomIcon, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { logout } from '@/redux';
import { ApolloError, useMutation } from '@apollo/client';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import DeleteAccountModal from './confirm-account-deletion';
import { Picker } from '@react-native-picker/picker';
import ReasonPickerModal from './reason-picker-modal';
import { Ionicons } from '@expo/vector-icons';

export default function DeleteAccount() {
  // States
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDelteModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const reasons = [
    'I have privacy concerns',
    'I have a duplicate account',
    'I do not find this app useful',
    'I am receiving too many notifications',
    'Other',
  ];
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  // Mutations
  const [mutateDelete] = useMutation(DELETE_USER);

  // Hooks
  const appTheme = useThemeColor();

  // Handlers
  const handleDeleteModalToggle = () => {
    setIsDelteModalOpen((prev) => !prev);
  };
  const handleDeleteSubmission = async () => {
    try {
      const {
        data: {
          deleteUser: { message, description, status },
        },
      } = await mutateDelete();
      router.replace('/');
      dispatch(logout());
      Alert.alert(message, description, [{ text: 'Ok', onPress: handleDeleteModalToggle }, { style: 'default' }]);
    } catch (err) {
      const error = err as ApolloError;
      Alert.alert('Error', error.message, [{ text: 'Ok', onPress: handleDeleteModalToggle }, { style: 'destructive' }]);

    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1
      }}
    >
      <View className=" p-6 flex-1" style={{ backgroundColor: appTheme.background }}>
        <View className="mt-4">
          <View className="flex-row items-center space-x-2 p-4 border border-red-400 dark:border-dark-border/30 rounded-xl bg-red-50 dark:bg-dark-card">
            <CustomText variant='label' fontSize='sm' className=" text-gray-500 mb-6">
              We're sorry to see you go. Your data will be automatically deleted after 30 days. If you change your mind please login within 30 days to
              restore your account.
            </CustomText>
          </View>

          {/* Dropdown for reason */}
          <CustomText variant='label' fontSize='sm' className="mt-6 mb-2 text-base font-semibold" style={{ color: appTheme.text }}>
            Reason for deleting your account
          </CustomText>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsReasonModalOpen(true)}
            className="
            rounded-xl
            border
            mb-4
            px-4
            py-4
            flex-row
            items-center
            justify-between
            "
            style={{
              borderColor: appTheme.border,
              backgroundColor: appTheme.card,
            }}
          >
            <Text style={{ color: selectedReason ? appTheme.text : appTheme.lightGray }}>
              {selectedReason || 'Select a reason...'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={22}
              color={appTheme.textSecondary || '#888'}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>

        </View>

        <View className='flex-1'>
          <Image
            source={require('@/assets/GIFs/delete.gif')}
            width={100}
            height={100}
            resizeMode="contain"
            className={` w-[100%] h-[25rem] mx-auto block `}
          />
        </View>

        <Pressable className="bg-red-500 rounded-2xl py-4 items-center shadow-md active:opacity-80" onPress={handleDeleteModalToggle}>
          <View className="flex-row items-center space-x-2 justify-between w-[55%]">
            <CustomIcon icon={{ name: 'trash', type: 'FontAwesome6', color: 'white', size: 20 }} />
            <CustomText className="text-white font-semibold text-base" style={{ color: '#ffff' }}>
              Delete My Account
            </CustomText>
          </View>
        </Pressable>

        {/* Modal */}
        <ReasonPickerModal
          visible={isReasonModalOpen}
          reasons={reasons}
          selectedReason={selectedReason}
          onSelect={setSelectedReason}
          onClose={() => setIsReasonModalOpen(false)}
          appTheme={appTheme}
        />

        <DeleteAccountModal
          visible={isDeleteModalOpen}
          key={'delete_user_confirmation_modal'}
          onClose={handleDeleteModalToggle}
          onConfirm={handleDeleteSubmission}
        />
      </View>
    </ScrollView>
  );
}
