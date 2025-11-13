import { View, Text } from 'react-native';

export default function GymHome() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>💪 GYM SERVICE</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>This is the gym service main page</Text>
    </View>
  );
}