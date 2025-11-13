// app/(profile)/addPaymentMethod.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import GradientBackground from "@/components/common/GradientBackground/GradientBackground";

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpirationDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)} / ${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text.replace(/\s/g, ""));
    setCardNumber(formatted);
  };

  const handleExpirationDateChange = (text: string) => {
    const formatted = formatExpirationDate(text);
    setExpirationDate(formatted);
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setCvv(cleaned.substring(0, 4)); // Max 4 digits for AMEX
  };

  const validateForm = () => {
    if (!cardNumber.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter card number",
      });
      return false;
    }

    const cardDigits = cardNumber.replace(/\s/g, "");
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid card number",
      });
      return false;
    }

    if (!expirationDate.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter expiration date",
      });
      return false;
    }

    const expParts = expirationDate.split(" / ");
    if (expParts.length !== 2 || expParts[0].length !== 2 || expParts[1].length !== 2) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid expiration date (MM / YY)",
      });
      return false;
    }

    const month = parseInt(expParts[0]);
    if (month < 1 || month > 12) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid month (01-12)",
      });
      return false;
    }

    if (!cvv.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter CVV",
      });
      return false;
    }

    if (cvv.length < 3) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid CVV (3-4 digits)",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Payment method added successfully!",
      });

      router.back();
    } catch (error: any) {
      console.error("Error adding payment method:", error);

      Toast.show({
        type: "error",
        text1: "Failed",
        text2: "Failed to add payment method. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              keyboardShouldPersistTaps="handled"
            >
              <View className="px-6 py-6">
                <Text className="text-3xl font-bold text-gray-900">
                  Add payment methods
                </Text>
                <Text className="text-base text-gray-600 mt-2">
                  Add a credit or debit card to quickly complete purchases.
                </Text>
              </View>

              <View className="px-6">
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Card number
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={cardNumber}
                      onChangeText={handleCardNumberChange}
                      placeholder="Card number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      className="bg-white rounded-2xl px-6 py-4 text-base text-gray-900 pr-12"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }}
                      editable={!isSaving}
                    />
                    <View className="absolute right-4 top-4">
                      <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Expiration date
                  </Text>
                  <TextInput
                    value={expirationDate}
                    onChangeText={handleExpirationDateChange}
                    placeholder="Expiration date (MM / YY)"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="bg-white rounded-2xl px-6 py-4 text-base text-gray-900"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                    editable={!isSaving}
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    CVV
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={cvv}
                      onChangeText={handleCvvChange}
                      placeholder="Security code"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      secureTextEntry={true}
                      className="bg-white rounded-2xl px-6 py-4 text-base text-gray-900 pr-12"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }}
                      editable={!isSaving}
                    />
                    <TouchableOpacity className="absolute right-4 top-4">
                      <Ionicons
                        name="help-circle-outline"
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View
              className="px-6"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                className="rounded-full py-4"
                style={{
                  backgroundColor: isSaving ? "#9CA3AF" : "#3853A4",
                }}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}