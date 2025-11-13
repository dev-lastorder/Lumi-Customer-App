// Components
import { ScreenHeader } from '@/components';

// Interfaces
import { IEditProfileContentHeaderProps } from '@/utils/interfaces';

// React Native
import { View } from 'react-native';

export default function EditProfileContentHeader({ title }: IEditProfileContentHeaderProps) {
  return (
    <View className='mx-4 mt-8'>
      <ScreenHeader title={title} key={title} />
    </View>
  );
}
