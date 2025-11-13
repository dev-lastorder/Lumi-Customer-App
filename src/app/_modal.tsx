import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(modal)"
        options={{
          presentation: Platform.OS === 'ios' ? 'transparentModal' : 'transparentModal',
          animation: 'slide_from_bottom',
          headerShown: false,
          contentStyle: {
            backgroundColor: 'yellow',
          },
        }}
      />
    </Stack>
  );
}
