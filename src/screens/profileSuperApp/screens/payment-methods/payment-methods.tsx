// app/(profile)/payment-methods.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import GradientBackground from "@/components/common/GradientBackground/GradientBackground";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "apple";
  lastFour: string;
  isDefault: boolean;
}

export default function PaymentMethodPersonalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "visa", lastFour: "9432", isDefault: true },
    { id: "2", type: "mastercard", lastFour: "4891", isDefault: false },
    { id: "3", type: "apple", lastFour: "0284", isDefault: false },
  ]);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const handleOptionsPress = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setShowOptionsModal(true);
  };

  const handleSetDefault = () => {
    if (!selectedPaymentId) return;

    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === selectedPaymentId,
      }))
    );

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Payment method set as default",
    });

    setShowOptionsModal(false);
    setSelectedPaymentId(null);
  };

  const handleRemove = () => {
    if (!selectedPaymentId) return;

    const methodToRemove = paymentMethods.find((pm) => pm.id === selectedPaymentId);
    
    if (methodToRemove?.isDefault && paymentMethods.length > 1) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Cannot remove default payment method. Set another as default first.",
      });
      setShowOptionsModal(false);
      return;
    }

    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== selectedPaymentId));

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Payment method removed successfully",
    });

    setShowOptionsModal(false);
    setSelectedPaymentId(null);
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return { name: "card-outline" as const, color: "#1A1F71", bgColor: "#F7F8FA" };
      case "mastercard":
        return { name: "card" as const, color: "#EB001B", bgColor: "#FFF5F5" };
      case "apple":
        return { name: "logo-apple" as const, color: "#000000", bgColor: "#F7F8FA" };
      default:
        return { name: "card-outline" as const, color: "#6B7280", bgColor: "#F3F4F6" };
    }
  };

  return (
    <GradientBackground>
      <View className="flex-1">
        <View
          style={{ paddingTop: insets.top + 10 }}
          className="px-6 pb-4 flex-row items-center"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4"
          >
            <Ionicons name="arrow-back" size={18} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 flex-1 text-center mr-16">
            Your Profile
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <View className="px-6 py-6">
            <Text className="text-3xl font-bold text-gray-900">
              Payment methods
            </Text>
            <Text className="text-base text-gray-600 mt-2">
              Add or Update your saved payment methods.
            </Text>
          </View>

          <View className="px-6">
            {paymentMethods.map((method) => {
              const cardIcon = getCardIcon(method.type);
              return (
                <View
                  key={method.id}
                  className="py-4 flex-row items-center"
                >
                  <View 
                    className="w-16 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: cardIcon.bgColor }}
                  >
                    <Ionicons 
                      name={cardIcon.name} 
                      size={32} 
                      color={cardIcon.color} 
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      **** {method.lastFour}
                    </Text>
                  </View>

                  {method.isDefault && (
                    <View
                      className="px-3 py-1 rounded-full mr-2"
                      style={{ backgroundColor: "rgba(211, 242, 250, 1)" }}
                    >
                      <Text className="text-sm font-medium" style={{ color: "#3853A4" }}>
                        Default
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => handleOptionsPress(method.id)}
                    className="p-2"
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View
          className="absolute bottom-0 left-0 right-0 px-6"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(profile)/addPaymentMethod")}
            className="rounded-full py-4 flex-row items-center justify-center"
            style={{ backgroundColor: "#3853A4" }}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white text-center text-lg font-semibold ml-2">
              Add payment method
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showOptionsModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowOptionsModal(false)}
        >
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <TouchableOpacity
              className="flex-1"
              activeOpacity={1}
              onPress={() => setShowOptionsModal(false)}
            />
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-900">
                  More options
                </Text>
                <TouchableOpacity
                  onPress={() => setShowOptionsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={20} color="#1F2937" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSetDefault}
                className="flex-row items-center py-4"
              >
                <Ionicons name="checkmark" size={24} color="#1F2937" />
                <Text className="text-base font-medium text-gray-900 ml-4">
                  Set as default
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRemove}
                className="flex-row items-center py-4"
              >
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <Text className="text-base font-medium text-red-500 ml-4">
                  Remove payment method
                </Text>
              </TouchableOpacity>

              <View style={{ height: insets.bottom }} />
            </View>
          </View>
        </Modal>
      </View>
    </GradientBackground>
  );
}