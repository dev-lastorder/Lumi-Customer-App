// app/(ride)/index.tsx
import { View, Text } from 'react-native';

export default function FoodHome() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Food service</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>This is the ride service main page</Text>
    </View>
  );
}