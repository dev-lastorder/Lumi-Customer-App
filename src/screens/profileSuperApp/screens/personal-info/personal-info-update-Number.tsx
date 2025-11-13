// app/(profile)/personal-info-update-number.tsx
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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import GradientBackground from "@/components/common/GradientBackground/GradientBackground";
import { RootState } from "@/redux";
import { updateUser } from "@/redux";
import { UserApi } from "@/services/userApi";

export default function PersonalInfoUpdateNumberScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authSuperApp.user);
  const token = useSelector((state: RootState) => state.authSuperApp.token);

  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePhone = async () => {
    if (!phone.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your phone number",
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Authentication token missing",
      });
      return;
    }

    setIsUpdating(true);

    try {
      console.log("Updating phone to:", phone);

      const response = await UserApi.updatePhone(phone.trim(), token);

      console.log("Phone update response:", response);

      dispatch(
        updateUser({
          phone: response.user.phone,
          name: response.user.name,
          profile: response.user.profile,
          email: response.user.email,
          phone_is_verified: response.user.phone_is_verified,
          email_is_verified: response.user.email_is_verified,
        })
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Phone number updated successfully!",
      });

      router.back();
    } catch (error: any) {
      console.error("Error updating phone:", error);
      console.error("Error details:", error.response?.data);

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2:
          error.response?.data?.message ||
          "Failed to update phone number. Please try again.",
      });
    } finally {
      setIsUpdating(false);
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
            </View>

            <View className="flex-1 px-6">
              <Text className="text-3xl font-bold text-gray-900">
                Phone number
              </Text>
              <Text className="text-base text-gray-600 mt-2 mb-8">
                This is the phone number associated with your account.
              </Text>

              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  Phone number
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  className="bg-white rounded-2xl px-6 py-4 text-base text-gray-900"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                  editable={!isUpdating}
                />
                {user?.phone_is_verified && (
                  <View className="flex-row items-center mt-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10B981"
                    />
                    <Text className="text-sm text-green-600 ml-2">
                      Phone number verified
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View
              className="px-6"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              <TouchableOpacity
                onPress={handleUpdatePhone}
                disabled={isUpdating || !phone.trim()}
                className="rounded-full py-4"
                style={{
                  backgroundColor:
                    isUpdating || !phone.trim() ? "#9CA3AF" : "#3853A4",
                }}
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    Update
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