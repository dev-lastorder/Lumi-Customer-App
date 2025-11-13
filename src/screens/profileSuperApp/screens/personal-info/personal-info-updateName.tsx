// app/(profile)/personal-info-update-name.tsx
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

export default function PersonalInfoUpdateNameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authSuperApp.user);
  const token = useSelector((state: RootState) => state.authSuperApp.token);

  const [name, setName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your name",
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
      console.log("Updating name to:", name);

      const response = await UserApi.updateName(name.trim(), token);

      console.log("Name update response:", response);

      dispatch(
        updateUser({
          name: response.user.name,
          profile: response.user.profile,
          phone: response.user.phone,
          email: response.user.email,
          phone_is_verified: response.user.phone_is_verified,
          email_is_verified: response.user.email_is_verified,
        })
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Name updated successfully!",
      });

      router.back();
    } catch (error: any) {
      console.error("Error updating name:", error);
      console.error("Error details:", error.response?.data);

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2:
          error.response?.data?.message ||
          "Failed to update name. Please try again.",
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
              <Text className="text-3xl font-bold text-gray-900">Name</Text>
              <Text className="text-base text-gray-600 mt-2 mb-8">
                This is the name you would like other people to use when
                referring to you.
              </Text>

              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  Full name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
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
              </View>
            </View>

            <View
              className="px-6"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              <TouchableOpacity
                onPress={handleUpdateName}
                disabled={isUpdating || !name.trim()}
                className="rounded-full py-4"
                style={{
                  backgroundColor:
                    isUpdating || !name.trim() ? "#9CA3AF" : "#3853A4",
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