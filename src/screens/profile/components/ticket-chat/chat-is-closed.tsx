// Icons
import { Ionicons } from '@expo/vector-icons';

// GQL
import { GET_ALL_TICKETS, UPDATE_TICKET_STATUS } from '@/api';

// Hooks
import { useMutation } from '@apollo/client';
import { useLocalSearchParams } from 'expo-router';

// React Native
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomText } from '@/components';

export default function TicketClosedMessage() {
  // Hooks
  const { ticketId } = useLocalSearchParams();

  // Mutations
  const [updateTicketStatus, { loading }] = useMutation(UPDATE_TICKET_STATUS, {
    refetchQueries: [
      {
        query: GET_ALL_TICKETS,
      },
    ],
    onCompleted: () => {
      Alert.alert('Success', 'Ticket re-opened successfully');
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error.message ||
        'An error occured while re-opening the ticket. Please try again after some time.'
      );
    },
  });

  // Handlers
  const handleReOpen = () => {
    updateTicketStatus({
      variables: {
        input: {
          ticketId,
          status: 'open',
        },
      },
    }).catch((err) => {
      // This is to prevent unhandled promise rejection.
      // The actual error is handled by the `onError` callback in `useMutation`.
      console.log(
        'Silently catching error from updateTicketStatus mutation',
        err
      );
    });
  };

  return (
    <View
      className="bg-card dark:bg-dark-card border border-border dark:border-dark-border/30"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 10,
        borderWidth: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Ionicons name="alert-circle" size={20} color="#f43f5e" />
        <CustomText
          style={{
            marginLeft: 8,

            fontWeight: '500',
            fontSize: 14,
          }}
        >
          Ticket is closed. You cannot send messages.
        </CustomText>
      </View>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#2563eb',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
          marginLeft: 10,
          minWidth: 95,
          justifyContent: 'center',
        }}
        activeOpacity={0.7}
        onPress={handleReOpen}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Ionicons name="refresh" size={16} color="#ffffff" />
            <CustomText
              style={{
                color: '#ffffff',
                fontWeight: '600',
                marginLeft: 4,
                fontSize: 13,
              }}
            >
              Re-Open
            </CustomText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
