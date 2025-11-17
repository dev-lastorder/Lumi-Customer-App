import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


import HomePageMainScreen from "@/screens/HomeScreen/screens/main";

import AiChat from "./(ai-chat)";
import ProfileMainSuperAppScreen from "@/screens/profileSuperApp/screens/profileMain";


export default function CustomTabsScreen() {
  const [activeTab, setActiveTab] = useState("Home");
  const insets = useSafeAreaInsets();


  

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePageMainScreen />;
      case "Profile":
        return <ProfileMainSuperAppScreen />;
      case "Services":
        return <Home />;
      case "Center":
        return <AiChat />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">

      <View className="flex-1">
        {renderContent()}
      </View>

      <View
        style={{
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        className="flex-row items-center justify-around bg-white pt-2 border-t border-gray-200 "
      >
        <TouchableOpacity
          className="flex-1 items-center py-2"
          onPress={() => setActiveTab("Home")}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={activeTab === "Home" ? "#0284c7" : "#6b7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Home" ? "text-sky-600 font-bold" : "text-gray-500"
              }`}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Services */}
        <TouchableOpacity
          className="flex-1 items-center py-2"
          onPress={() => setActiveTab("Services")}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color={activeTab === "Services" ? "#0284c7" : "#6b7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Services"
              ? "text-sky-600 font-bold"
              : "text-gray-500"
              }`}
          >
            Services
          </Text>
        </TouchableOpacity>

        {/* Floating Center Button */}
        <View className="flex-1 items-center">
          <TouchableOpacity
            className="absolute -top-12 w-16 h-16 rounded-full items-center justify-center shadow-lg"
            onPress={() => setActiveTab("Center")}
            activeOpacity={0.9}
          >
            <Image
              source={require("@/assets/images/chatBotLogo.png")}
              style={{ width: 90, height: 90 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>


        {/* Activity */}
        <TouchableOpacity
          className="flex-1 items-center py-2"
          onPress={() => setActiveTab("Activity")}
        >
          <MaterialIcons
            name="history"
            size={24}
            color={activeTab === "Activity" ? "#0284c7" : "#6b7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Activity"
              ? "text-sky-600 font-bold"
              : "text-gray-500"
              }`}
          >
            Activity
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          className="flex-1 items-center py-2"
          onPress={() => setActiveTab("Profile")}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={activeTab === "Profile" ? "#0284c7" : "#6b7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Profile"
              ? "text-sky-600 font-bold"
              : "text-gray-500"
              }`}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
