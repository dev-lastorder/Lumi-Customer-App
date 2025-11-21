import { GET_ALL_TICKETS } from '@/api/graphql/query';
import placeholderImage from '@/assets/images/no-coupons-found.png';
import { LoadingPlaceholder, NoData } from '@/components';
import { useAppSelector } from '@/redux';
import { ISuportTicket } from '@/utils/interfaces/support';
import { useQuery } from '@apollo/client';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import Ticket from './ticket';

export default function TicketsMain() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id || user?.userId;

  const { data: tickets, loading: ticketsAreLoading, refetch } = useQuery(GET_ALL_TICKETS, {
    variables: { input: { userId } },
    fetchPolicy: 'network-only',
  });

  useFocusEffect(
    useCallback(() => {
      refetch({ variables: { input: { userId } } });
    }, [refetch, userId])
  );

  if (ticketsAreLoading) {
    return <LoadingPlaceholder />;
  }

  console.log(tickets, "tickets");

  if (!tickets || !tickets.getSingleUserSupportTickets || tickets.getSingleUserSupportTickets.tickets.length === 0) {
    return (
      <NoData
        title="No Tickets Found"
        description="There are currently no tickets available in your account."
        imageSource={placeholderImage}
      />
    );
  }

  return (
    <View className="my-4 bg-background dark:bg-dark-background">
      {tickets?.getSingleUserSupportTickets?.tickets?.map((ticket: ISuportTicket) => (
        <Ticket
          key={ticket._id}
          description={ticket.description}
          title={ticket.title}
          createdAt={ticket.createdAt}
          status={ticket.status}
          userType={ticket.userType}
          id={ticket._id}
        />
      ))}

    </View>
  );
}

