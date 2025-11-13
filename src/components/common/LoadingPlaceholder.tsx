import { useThemeColor } from '@/hooks';
import { ActivityIndicator, View } from 'react-native';
import { ILoadingPlaceholderComponentProps } from './interfaces';
import { CustomText } from './CustomText';

const LoadingPlaceholder = ({ size = 'large', placeholder }: ILoadingPlaceholderComponentProps) => {
  const { primary } = useThemeColor();

  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background gap-4">
      <ActivityIndicator size={size} color={primary} />
      <CustomText variant="label">{placeholder}</CustomText>
    </View>
  );
};

export default LoadingPlaceholder;
