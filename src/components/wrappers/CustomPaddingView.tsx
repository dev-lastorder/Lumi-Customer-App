import { CustomPaddingViewProps } from '@/utils/interfaces';
import { View, ViewProps } from 'react-native';

export default function CustomPaddedView({
  children,
  padding = 16,
  paddingHorizontal,
  paddingVertical,
  ...props
}: CustomPaddingViewProps & ViewProps) {
  return (
    <View style={{ padding: padding, paddingHorizontal, paddingVertical }} {...props}>
      {children}
    </View>
  );
}
