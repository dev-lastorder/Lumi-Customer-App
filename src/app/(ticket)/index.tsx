import { View, Text } from 'react-native';

export default function TicketHome() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3e8ff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🎫 TICKET SERVICE</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>This is the ticket service main page</Text>
    </View>
  );
}