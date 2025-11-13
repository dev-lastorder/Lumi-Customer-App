import React from 'react';

// 📦 React Native Core
import { FlatList, ScrollView, View } from 'react-native';

// 🧩 Components
import { CustomHeader, LoadingPlaceholder, ScreenWrapperWithAnimatedHeader } from '@/components';
import NoData from '@/components/common/EmptyLayout';
import CustomIconButtom from '@/components/common/Buttons/CustomIconButton';
import AddressesListCard from '../components/my-addresses/my-addresses.list-card';
import placeholderImage from '@/assets/images/no-coupons-found.png';

// 🧭 Navigation
import { useRouter } from 'expo-router';

// 📡 GraphQL & API
import { useQuery } from '@apollo/client';
import { GET_ALL_ADDRESSES } from '@/api';

// 🪝 Hooks
import { useAddNewAddress } from '@/hooks/useAddNewAddress';

const MyAddresses = () => {
  // ✅ Navigation
  const router = useRouter();

  // 🧠 State & Logic
  const { resetAddress } = useAddNewAddress();

  // 📡 GraphQL Query
  const { data, loading, error } = useQuery(GET_ALL_ADDRESSES);

  // 📦 Fallback and Data
  const addresses = data?.profile?.addresses || [];
  const isDataAvailble = addresses.length > 0;

  // 🔁 Render List Item
  const renderItem = ({ item }: any) => <AddressesListCard address={item} />;

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* header */}
      <CustomHeader title={'Saved Addresses'} showGoBack={true} onGoBack={() => {
        router.dismissAll();
        router.replace('/(food-delivery)/(profile)/profile-main')
      }} rightIcons={[]} />

      {/* content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} className="">
        <View className="relative">
          {/* Content */}
          {loading ? (
            <LoadingPlaceholder />
          ) : addresses.length === 0 ? (
            <NoData
              imageSource={placeholderImage}
              title="There aren’t any addresses yet 😕"
              description="You haven’t saved any addresses yet. Add one to get started 🏠"
              imageStyles={{ width: 200, height: 200, alignSelf: 'center' }}

            />
          ) : (
            <FlatList data={addresses} keyExtractor={(item) => item._id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 120 }} />
          )}
        </View>
      </ScrollView>

      {/* Stikcy Bottom Button */}
      <View className=" absolute bottom-0 left-0 right-0 mx-auto pb-5 px-4 pt-1 bg-background dark:bg-dark-background ">
        <CustomIconButtom
          label="Add new address"
          onPress={() => {
            resetAddress();
            router.push('/(food-delivery)/(profile)/add-new-address');
          }}
          textColor="white"
          width={'100%'}
          backgroundColor="#A5C616"
          borderRadius={16}
          padding={12}
          textStyle={{ fontSize: 16, fontWeight: '500' }}
          height={50}
        />
      </View>
    </View>
  );
};

export default MyAddresses;
