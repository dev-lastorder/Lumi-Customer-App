// src/screens/order-details/OrderDetailScreen.tsx

import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

// ─── Components & Modals ─────────────────────────────────────
import { CustomHeader, CustomText, ScreenWrapperWithAnimatedHeader } from '@/components';
import CheckoutButton from '../components/order-details/checkout-button';
import TrialBanner from '../components/order-details/trial-banner';
import OrderItemList from '../components/order-details/order-item-list';
import RecommendedList from '../components/order-details/recommended-list';
import { AddMessageRow } from '../components/order-details/add-message-row';
import CutleryModal from '../components/order-details/cutlery-modal';
import { AddCutleryRow } from '../components/order-details/add-cutlery-row';

import { MessageModal } from '../components/order-details/message-modal';
import { useAppSelector } from '@/redux';
import EmptyCart from '../components/order-details/EmptyCart';
import { FlatList } from 'react-native-gesture-handler';
import { GET_RESTAURANT_DETAILS } from '@/api';
import { useQuery } from '@apollo/client';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';

export default function OrderDetailScreen() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [cutleryModalVisible, setCutleryModalVisible] = useState(false);

  const items = useAppSelector((state) => state.cart.items);
  const currentRestaurantId = useAppSelector((state) => state.cart.currentRestaurantId);

  // API
  const { loading, data } = useQuery(GET_RESTAURANT_DETAILS, {
    variables: { id: currentRestaurantId },
    skip: !currentRestaurantId,
  });

  return (
    <ScreenWrapperWithAnimatedTitleHeader
      title={loading ? 'Loading...' : data?.restaurant?.name}
      footer={
        Object.values(items).length > 0 ? (

          <CheckoutButton
            count={Object.values(items).length}
            total={Object.values(items).reduce((acc, item) => item.unitPrice * item.quantity + acc, 0)}
            onPress={() => {
              router.dismiss();
              router.push('/order-checkout')
            }}
          />

        ) : (
          <> </>
        )
      }
    >
      {/* // <ScreenWrapperWithAnimatedHeader
    //   title={loading ? 'Loading...' : data?.restaurant?.name}
    //   showGoBack
    //   showSettings={false}
    //   showLocationDropdown={false}
    //   showMap={false}
    //   contentContainerStyle={{ marginTop: 0 }}
    // > */}
      <View className=" bg-white dark:bg-dark-background ">
        {Object.values(items).length > 0 ? (
          <>
            {/* <CustomHeader title={loading ? 'Loading...' : data?.restaurant?.name} subtitle="Your Order" showGoBack onGoBack={() => router.back()} /> */}

            <FlatList
              data={[]}
              ListHeaderComponent={
                <>
                  <AddMessageRow comment={message} onPress={() => setMessageModalVisible(true)} />
                  <OrderItemList />
                  <AddCutleryRow onPress={() => setCutleryModalVisible(true)} />
                  <CustomText className="mt-5 mb-4" fontWeight='semibold' fontSize='md'>Recommended for you</CustomText>
                  <RecommendedList />
                </>
              }
              ListFooterComponent={<View className="h-20" />}
              keyExtractor={() => 'dummy'}
              renderItem={null}
              contentContainerStyle={{ padding: 16, paddingTop: 0 }}
            />

            {/* <CheckoutButton
              count={Object.values(items).length}
              total={Object.values(items).reduce((acc, item) => item.unitPrice * item.quantity + acc, 0)}
              onPress={() => router.push('/(food-delivery)/(store)/order-checkout')}
            /> */}

            <MessageModal
              visible={messageModalVisible}
              initialComment={message ?? ''}
              onSave={(newComment) => {
                setMessage(newComment || null);
                setMessageModalVisible(false);
              }}
              onClose={() => setMessageModalVisible(false)}
            />

            <CutleryModal visible={cutleryModalVisible} onClose={() => setCutleryModalVisible(false)} />
          </>
        ) : (
          <View className="flex-1">
            <EmptyCart />
          </View>
        )}
      </View>
      {/* // </ScreenWrapperWithAnimatedHeader> */}
    </ScreenWrapperWithAnimatedTitleHeader>
  );
}
