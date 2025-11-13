// app/(profile)/addFund.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';



const DUMMY_CARDS = [
  { id: '1', type: 'mastercard', lastFour: '1412', selected: true },
  { id: '2', type: 'visa', lastFour: '9432', selected: false },
];

export default function AddFundScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(DUMMY_CARDS[0]);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
const { currency } = useSelector((state: RootState) => state.appConfig);


const AMOUNT_OPTIONS = [
  { id: '1', value: 10.00, label: `${currency?.code} 10.00` },
  { id: '2', value: 20.00, label: `${currency?.code} 20.00` },
  { id: '3', value: 40.00, label: `${currency?.code} 40.00` },
  { id: '4', value: 50.00, label: `${currency?.code} 50.00` },
];

  const handleAmountSelect = (value: number) => {
    setAmount(value.toFixed(2));
    Keyboard.dismiss();
  };

  const handleSelectCard = (card: typeof DUMMY_CARDS[0]) => {
    setSelectedCard(card);
    setShowPaymentModal(false);
  };

  const handleAddPaymentMethod = () => {
    setShowPaymentModal(false);
    setShowAddCardModal(true);
  };

  const handleSaveCard = () => {
    setShowAddCardModal(false);
    setCardNumber('');
    setExpiryDate('');
    setSecurityCode('');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center px-5 pt-14 pb-5 z-10 bg">
              <TouchableOpacity 
                className="w-10 h-10 rounded-full bg-white justify-center items-center"
                onPress={() => router.push("/(ride)/customer-ride")}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-black flex-1 text-center mr-10">
                Your Profile
              </Text>
            </View>

            {/* Content */}
            <View className="flex-1 px-6 pt-8">
              {/* Title */}
              <Text className="text-4xl font-bold text-black mb-2">Add funds</Text>
              <Text className="text-base text-gray-600 mb-8">
                Add a credit or debit card to quickly complete purchases.
              </Text>

              {/* Offer your fare section */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-black mb-1">
                  Offer your fare <Text className="text-red-500">*</Text>
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Enter an amount between {currency?.code} 10.00 and {currency?.code} 500
                </Text>

                {/* Amount Input */}
                <TextInput
                  className="bg-white rounded-full px-6 py-4 text-2xl font-normal mb-4"
                  placeholder={`${currency?.code}  0.00`}
                  value={amount ? `${currency?.code}  ${amount}` : ''}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9.]/g, '');
                    setAmount(numericValue);
                  }}
                  keyboardType="decimal-pad"
                />

                {/* Amount Options */}
                <FlatList
                  data={AMOUNT_OPTIONS}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ gap: 12 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="py-3 px-6 rounded-full border border-gray-300"
                      onPress={() => handleAmountSelect(item.value)}
                    >
                      <Text className="text-base font-semibold text-black">
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>

            {/* Bottom Section - Card and Button */}
            <View className="px-6 pb-8">
              {/* Selected Card */}
              <TouchableOpacity 
                className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-4 mb-4"
                onPress={() => setShowPaymentModal(true)}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-8 bg-blue-600 rounded justify-center items-center">
                    <Text className="text-white text-xs font-bold">
                      {selectedCard.type === 'visa' ? 'VISA' : 'MC'}
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-black">
                    **** {selectedCard.lastFour}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>

              {/* Add Funds Button */}
              <TouchableOpacity 
                className="rounded-full py-4 items-center"
                style={{ backgroundColor: '#1691BF' }}
              >
                <Text className="text-white text-lg font-semibold">Add funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-black flex-1 text-center">
                Choose payment method
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Card List */}
            {DUMMY_CARDS.map((card) => (
              <TouchableOpacity
                key={card.id}
                className="flex-row items-center justify-between py-4 border-b border-gray-200"
                onPress={() => handleSelectCard(card)}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-8 bg-blue-600 rounded justify-center items-center">
                    <Text className="text-white text-xs font-bold">
                      {card.type === 'visa' ? 'VISA' : 'MC'}
                    </Text>
                  </View>
                  <Text className="text-base font-medium text-black">
                    **** {card.lastFour}
                  </Text>
                </View>
                {selectedCard.id === card.id && (
                  <Ionicons name="checkmark" size={24} color="#1691BF" />
                )}
              </TouchableOpacity>
            ))}

            {/* Add Payment Method */}
            <TouchableOpacity
              className="flex-row items-center gap-3 py-4 mt-2"
              onPress={handleAddPaymentMethod}
            >
              <Ionicons name="add" size={24} color="#000" />
              <Text className="text-base font-medium text-black">Add payment method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCardModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={() => setShowAddCardModal(false)}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-black flex-1 text-center mr-6">
                Choose payment method
              </Text>
              <TouchableOpacity onPress={() => setShowAddCardModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Card Number Input */}
            <View className="mb-4">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3"
                placeholder="Card number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
              />
              <View className="absolute right-4 top-3">
                <Ionicons name="card-outline" size={24} color="#999" />
              </View>
            </View>

            {/* Expiration Date Input */}
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Expiration date (MM / YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="number-pad"
            />

            {/* Security Code Input */}
            <View className="mb-6">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3"
                placeholder="Security code"
                value={securityCode}
                onChangeText={setSecurityCode}
                keyboardType="number-pad"
                secureTextEntry
              />
              <View className="absolute right-4 top-3">
                <Ionicons name="help-circle-outline" size={24} color="#999" />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className="bg-gray-200 rounded-full py-4 items-center"
              onPress={handleSaveCard}
            >
              <Text className="text-gray-500 text-lg font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}