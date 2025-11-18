// Fixed HomeScreenCards component
import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Image, StyleSheet } from "react-native";
import { VideoItem } from "../banner/video-item";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const GAP = 10;
const SMALL_HEIGHT = 180;
const LARGE_HEIGHT = 350;

const DATA = [
  { id: "1", title: "LUMI Drive", type: "image", source: require("@/assets/GIFs/lumiDrive.gif"), icon: require("@/assets/images/lumiDriveLogo.png"), size: "small" },
  { id: "3", title: "LUMI Food", type: "image", source: require("@/assets/GIFs/lumiFood.gif"), icon: require("@/assets/images/lumiFoodLogo.png"), size: "large" },
  { id: "4", title: "LUMI Hotel", type: "image", source: require("@/assets/GIFs/lumiHotel.gif"), icon: require("@/assets/images/lumiHotelLogo.png"), size: "small" },
  { id: "2", title: "LUMI Ticket", type: "image", source: require("@/assets/GIFs/lumiFlight.gif"), icon: require("@/assets/images/lumiTicketLogo.png"), size: "small" },
  { id: "5", title: "LUMI Hotel", type: "image", source: require("@/assets/GIFs/lumiHotel.gif"), icon: require("@/assets/images/lumiHotelLogo.png"), size: "large" },
  { id: "6", title: "LUMI Hospitality", type: "image", source: require("@/assets/GIFs/lumiHospitality.gif"), icon: require("@/assets/images/lumiHospitalityLogo.png"), size: "small" },
];

export default function HomeScreenCards({ filterTitles = [], noBackground = false, }: { filterTitles?: string[], noBackground?: boolean; }) {
  const router = useRouter();

  const FILTERED_DATA = filterTitles.length
    ? DATA.filter(item => filterTitles.includes(item.title))
    : DATA;

  return (
    <ScrollView
      className={`flex-1 ${noBackground ? "" : "bg-white"} p-2`}
      showsVerticalScrollIndicator={false}
    >

      <View className="flex-row justify-between">
        {/* LEFT COLUMN */}
        <View style={{ width: width / 2 - GAP }}>
          {FILTERED_DATA.filter((_, i) => i % 2 === 0).map((item) => (
            <Card
              key={item.id}
              item={item}
              height={item.size === "large" ? LARGE_HEIGHT : SMALL_HEIGHT}
              router={router}
              noBackground={noBackground}
            />
          ))}
        </View>

        <View style={{ width: width / 2 - GAP }}>
          {FILTERED_DATA.filter((_, i) => i % 2 === 1).map((item) => (
            <Card
              key={item.id}
              item={item}
              height={item.size === "large" ? LARGE_HEIGHT : SMALL_HEIGHT}
              router={router}
              noBackground={noBackground}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Fixed Card component - removed duplicate function declaration
const Card = ({ item, height, router, noBackground }: { item: any; height: number; router: any, noBackground: boolean }) => {
  const handlePress = () => {
    switch (item.title) {
      case "LUMI Drive":
        router.push("/(ride)/customer-ride");
        break;
      case "LUMI Food":
        router.push("/(food-delivery)/(discovery)/discovery");
        break;
      case "LUMI Gym":
        router.push("/(gym)");
        break;
      case "LUMI Hotel":
        router.push("/(hotel)");
        break;
      case "LUMI Ticket":
        router.push("/(ticket)");
        break;
      case "LUMI Hospitality":
        router.push("/(hotel)");
        break;
      default:
        console.log("Clicked:", item.title);
    }
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={{
        width: noBackground ? "90%" : "100%",
        height,
        marginBottom: GAP,
      }}
      className="rounded-xl overflow-hidden"
      onPress={handlePress}
    >
      {item.type === "video" ? (
        <View className="flex-1 relative rounded-xl overflow-hidden">
          <VideoItem
            url={item.source}
            accessibilityLabel={`${item.title} promotional video`}
            accessible
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
          />

          {/* Overlay with title + icon */}
          <View className="flex-row absolute bottom-2 left-2 right-2 rounded-b-xl justify-between items-center px-2">
            <Text className="text-white font-semibold text-base">{item.title}</Text>
            <Image
              source={item.icon}
              className="w-12 h-7"
              resizeMode="contain"
            />
          </View>
        </View>

      ) : (
        <ImageBackground
          source={item.source}
          className="flex-1 justify-end"
          imageStyle={{ borderRadius: 15 }}
        >
          <View className="flex-row absolute bottom-2 left-2 right-2 rounded-b-xl justify-between items-center">
            <Text className="text-white font-semibold text-base">{item.title}</Text>
            <Image
              source={item.icon}
              className="w-12 h-7"
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      )}
    </TouchableOpacity>

  );
};