// app/(profile)/wallet.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import { RootState } from '@/redux';
import { useSelector } from 'react-redux';

const DUMMY_TRANSACTIONS = [
  {
    id: '1',
    type: 'top-up',
    title: 'Wallet Top up',
    date: 'Oct 5. 4:12 PM',
    amount: 120.0,
    isPositive: true,
    icon: '💳',
  },
  {
    id: '2',
    type: 'ride',
    title: 'Ride',
    date: 'Oct 5. 4:12 PM',
    amount: 48.75,
    isPositive: false,
    icon: '🚗',
  },
  {
    id: '3',
    type: 'women-ride',
    title: 'Women ride',
    date: 'Oct 1. 1:42 AM',
    amount: 62.4,
    isPositive: false,
    icon: '🚙',
  },
  {
    id: '4',
    type: 'ride',
    title: 'Ride',
    date: 'Sep 24. 8:19 PM',
    amount: 53.2,
    isPositive: false,
    icon: '🚗',
  },
  {
    id: '5',
    type: 'top-up',
    title: 'Wallet Top up',
    date: 'Oct 5. 4:12 PM',
    amount: 120.0,
    isPositive: true,
    icon: '💳',
  },
];

export default function WalletProfileScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const filteredTransactions = DUMMY_TRANSACTIONS.filter((transaction) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'money-in') return transaction.isPositive;
    if (activeFilter === 'money-out') return !transaction.isPositive;
    return true;
  });

  return (
    <GradientBackground>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-5 pt-14 pb-5">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-black flex-1 text-center mr-10">Your Profile</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View className="px-6 pt-8 pb-6">
            <Text className="text-4xl font-bold text-black mb-2">Wallet</Text>
            <Text className="text-base text-gray-600">View and manage your balance and transactions.</Text>
          </View>

          {/* Balance Card */}
          <View className="mx-5 p-6 rounded-3xl mb-8" style={{ backgroundColor: 'rgba(56, 83, 164, 0.3)' }}>
            <Text className="text-base text-black mb-2">Your balance</Text>
            <View className="flex-row justify-between items-center">
              <Text style={{ fontSize: 28 }} className="font-bold text-black">
                {currency?.code} 52.49
              </Text>
              <TouchableOpacity
                className="flex-row items-center px-5 py-3 rounded-full"
                style={{ backgroundColor: '#323F4F' }}
                onPress={() => router.push('/(profile)/addFund')}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text className="text-white text-base font-semibold ml-2">Add funds</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transactions Section */}
          <View className="px-5">
            <Text className="text-xl font-bold text-black mb-5">Transactions</Text>

            {/* Filter Tabs */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                className={`py-3 px-6 rounded-full border ${activeFilter === 'all' ? 'bg-cyan-100 border-cyan-100' : 'border-gray-300'}`}
                onPress={() => setActiveFilter('all')}
              >
                <Text className={`text-base font-medium ${activeFilter === 'all' ? 'text-cyan-600 font-semibold' : 'text-gray-600'}`}>All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`py-3 px-6 rounded-full border ${activeFilter === 'money-in' ? 'bg-cyan-100 border-cyan-100' : 'border-gray-300'}`}
                onPress={() => setActiveFilter('money-in')}
              >
                <Text className={`text-base font-medium ${activeFilter === 'money-in' ? 'text-cyan-600 font-semibold' : 'text-gray-600'}`}>
                  Money in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`py-3 px-6 rounded-full border ${activeFilter === 'money-out' ? 'bg-cyan-100 border-cyan-100' : 'border-gray-300'}`}
                onPress={() => setActiveFilter('money-out')}
              >
                <Text className={`text-base font-medium ${activeFilter === 'money-out' ? 'text-cyan-600 font-semibold' : 'text-gray-600'}`}>
                  Money out
                </Text>
              </TouchableOpacity>
            </View>

            {/* Transaction List */}
            <View className="pb-10 gap-2">
              {filteredTransactions.map((transaction) => (
                <TouchableOpacity key={transaction.id} className="flex-row justify-between items-center p-4 rounded-2xl" activeOpacity={0.7}>
                  <View className="flex-row items-center flex-1 gap-3">
                    <View className="w-12 h-12 rounded-xl justify-center items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                      <Text className="text-2xl">{transaction.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-black mb-1">{transaction.title}</Text>
                      <Text className="text-sm text-gray-600">{transaction.date}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-base font-semibold ${transaction.isPositive ? 'text-green-500' : 'text-black'}`}>
                      {transaction.isPositive ? '+' : '-'} {currency?.code} {transaction.amount.toFixed(2)}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}
