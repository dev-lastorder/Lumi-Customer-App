import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import GradientBackground from "@/components/common/GradientBackground/GradientBackground";
import { RootState } from "@/redux";
import { logoutSuper, clearSignupFormData } from "@/redux";

export default function ProfileMainSuperAppScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.authSuperApp.user);

  const menuItems = [
    {
      icon: "person-outline",
      title: "Personal info",
      subtitle: "Update your personal and contact details.",
      route: "/(profile)/personal-info",
    },
    {
      icon: "card-outline",
      title: "Payment methods",
      subtitle: "Add or Update your saved payment methods.",
      route: "/(profile)/payment-methods",
    },
    {
      icon: "wallet-outline",
      title: "Wallet",
      subtitle: "View and manage your balance, transactions,...",
      route: "/(profile)/wallet",
    },
    {
      icon: "location-outline",
      title: "My addresses",
      subtitle: "Update your saved addresses.",
      route: "/(profile)/myaddresses",
    },
    {
      icon: "help-circle-outline",
      title: "Support and feedback",
      subtitle: "Reach out for help or give feedback on your e...",
      route: "/(profile)/supportchat",
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutSuper());
            dispatch(clearSignupFormData());
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  return (
    <GradientBackground>
      <View className="flex-1">
        {/* Header with Back Button and Title */}
        <View 
          style={{ paddingTop: insets.top + 10 }}
          className="px-6 pb-4 flex-row items-center"
        >
          <TouchableOpacity
            onPress={() => router.push('/home')}
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
          {/* Profile Section */}
          <View className="flex-row items-center px-6 py-6">
            {user?.profile ? (
              <Image
                source={{ uri: user.profile }}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center">
                <Ionicons name="person" size={40} color="#6B7280" />
              </View>
            )}
            <View className="ml-5 flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {user?.name || "Guest User"}
              </Text>
              {user?.email && (
                <Text className="text-base text-gray-600 mt-1">
                  {user.email}
                </Text>
              )}
            </View>
          </View>

          {/* Menu Items - No background, no separation */}
          <View className="px-6 mt-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route)}
                className="flex-row items-center py-4"
              >
                <Ionicons name={item.icon} size={26} color="#374151" />
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
                  <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button with margin top */}
          <View className="px-6 mt-8">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white border-2 border-red-500 rounded-full py-4"
            >
              <Text className="text-red-500 text-center text-base font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}