// ====================================
// 📦 Imports
// ====================================
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// 🧩 Components
import { CustomIcon } from '@/components/common/Icon';
import { CustomHeader } from '@/components';

// 🧠 Types
import { UpdateAddressHeaderProps } from './interface';

// ====================================
// 📌 Component: UpdateAddressHeader
// ====================================
const UpdateAddressHeader: React.FC<UpdateAddressHeaderProps> = ({ setDeleteModalVisible }) => {
  const router = useRouter();

  return (
    <CustomHeader
      title="Edit delivery location"
      showGoBack={true}
      onGoBack={() => router.back()}
      rightIcons={[
        <TouchableOpacity
          key="delete"
          onPress={() => setDeleteModalVisible(true)}
          className="bg-icon-background dark:bg-dark-icon-background p-2 rounded-full"
        >
          <CustomIcon icon={{ size: 22, type: 'Ionicons', name: 'trash' }} />
        </TouchableOpacity>,
      ]}
    />
  );
};

export default UpdateAddressHeader;
