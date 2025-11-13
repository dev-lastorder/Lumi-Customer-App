// app/(profile)/personal-info.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import Toast from "react-native-toast-message";
import GradientBackground from "@/components/common/GradientBackground/GradientBackground";
import { RootState } from "@/redux";
import { updateUser } from "@/redux";
import { UserApi } from "@/services/userApi";

export default function PersonalInfoSuperAppScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authSuperApp.user);
  const token = useSelector((state: RootState) => state.authSuperApp.token);

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      console.log("Opening image picker...");

      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      console.log("Image picked:", image);

      if (image) {
        setSelectedImage(image);
        setShowPhotoModal(true);
      }
    } catch (error: any) {
      if (error.code !== "E_PICKER_CANCELLED") {
        console.error("Error picking image:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to open image picker. Please try again.",
        });
      }
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedImage || !token) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No image selected or token missing",
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log("Starting photo upload...");

      const response = await UserApi.updateProfilePhoto(selectedImage, token);

      console.log("Profile update response:", response);

      dispatch(
        updateUser({
          profile: response.user.profile,
          name: response.user.name,
          phone: response.user.phone,
          email: response.user.email,
          phone_is_verified: response.user.phone_is_verified,
          email_is_verified: response.user.email_is_verified,
        })
      );

      setShowPhotoModal(false);
      setSelectedImage(null);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile photo updated successfully!",
      });
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      console.error("Error details:", error.response?.data);

      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2:
          error.response?.data?.message ||
          "Failed to update profile photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelPhotoUpdate = () => {
    setShowPhotoModal(false);
    setSelectedImage(null);
  };

  const getDisplayUri = () => {
    if (selectedImage) {
      return selectedImage.sourceURL || selectedImage.path;
    }
    return user?.profile;
  };

  const handleNavigateToUpdateName = () => {
    router.push("/(profile)/personal-info-update-name");
  };

  const handleNavigateToUpdateNumber = () => {
    router.push("/(profile)/personal-info-update-number");
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
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View className="px-6 py-6">
            <Text className="text-3xl font-bold text-gray-900">
              Personal info
            </Text>
            <Text className="text-base text-gray-600 mt-2">
              Update your personal and contact details.
            </Text>
          </View>

          <View className="px-6 py-6">
            <View className="flex-row">
              <View className="relative">
                {getDisplayUri() ? (
                  <Image
                    source={{ uri: getDisplayUri() }}
                    className="w-32 h-32 rounded-full"
                    onError={(e) => {
                      console.log("Image load error:", e.nativeEvent.error);
                    }}
                  />
                ) : (
                  <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center">
                    <Ionicons name="person" size={60} color="#6B7280" />
                  </View>
                )}

                <TouchableOpacity
                  onPress={pickImage}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="pencil" size={20} color="#1F2937" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="px-6 mt-6">
            <TouchableOpacity
              className="py-4 border-b border-gray-200"
              onPress={handleNavigateToUpdateName}
            >
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Name
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-600">
                  {user?.name || "Not set"}
                </Text>
                <Ionicons name="chevron-forward" size={22} color="#6B7280" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 border-b border-gray-200"
              onPress={handleNavigateToUpdateNumber}
            >
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Phone number
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600 mr-2">
                    {user?.phone || "Not set"}
                  </Text>
                  {user?.phone_is_verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10B981"
                    />
                  )}
                </View>
                <Ionicons name="chevron-forward" size={22} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={showPhotoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelPhotoUpdate}
        >
          <View
            className="flex-1 bg-black/50 justify-end"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View className="bg-white rounded-t-3xl p-6">
              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                Profile photo
              </Text>
              <Text className="text-base text-gray-600 text-center mb-6">
                This is the photo you would like others to see.
              </Text>

              <TouchableOpacity
                onPress={handleUpdatePhoto}
                disabled={isUploading}
                className="rounded-full py-4 mb-3"
                style={{ backgroundColor: "#3853A4" }}
              >
                {isUploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    Update photo
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelPhotoUpdate}
                disabled={isUploading}
                className="py-4"
              >
                <Text className="text-gray-700 text-center text-lg font-medium">
                  Cancel
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