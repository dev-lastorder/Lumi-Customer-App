import { View, Text } from 'react-native';

export default function HotelHome() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef7cd' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🏨 HOTEL SERVICE</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>This is the hotel service main page</Text>
    </View>
  );
}