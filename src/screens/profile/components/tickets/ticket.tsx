// Components
import { CustomText } from '@/components';

// Utils
import { formatDate, getStatusColor } from '@/utils';
import { ITicketProps } from '@/utils/interfaces/support';
import { useRouter } from 'expo-router';

// React Native
import { TouchableOpacity, View } from 'react-native';

export default function Ticket({ title, description, createdAt, userType, status, id }: ITicketProps) {
  // Hooks
  const router = useRouter();

  // Validation
  const isUser = userType === 'User';

  // Helpers
  const formattedDate = formatDate(createdAt);
  const statusStyle = getStatusColor(status);

  return (
    <TouchableOpacity
      className="w-full items-center mb-4 px-4 bg-background dark:bg-dark-background"
      onPress={() =>
        router.push({
          pathname: '/ticket-chat',
          params: { ticketId: id, status },
        })
      }
    >
      <View className="w-full max-w-xl bg-background dark:bg-dark-background border border-gray-200 p-5 rounded-2xl shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <CustomText fontSize='md' fontWeight='semibold'>{title}</CustomText>
          <CustomText fontSize='xs' fontWeight='semibold' className={`px-2 py-1 rounded-full ${statusStyle}`}>{status.toUpperCase()}</CustomText>
        </View>
        <CustomText variant='body'>{description}</CustomText>
        <CustomText variant='caption'>
          {isUser ? 'You' : 'Admin'} • {formattedDate}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
}
