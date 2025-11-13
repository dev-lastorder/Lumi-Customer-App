import { Stack } from 'expo-router';

export default function AiChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chatScreen" />
    </Stack>
  );
}