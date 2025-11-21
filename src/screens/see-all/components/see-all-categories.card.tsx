import { CustomText } from "@/components";
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

interface CardProps {
  id: string;
  name: string;
  logo: string;
  backgroundColor?: string;
  onPress?: (Id: string) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  name,
  logo,
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      className="flex-1 m-1 rounded-xl overflow-hidden bg-bgLight dark:bg-dark-bgLight pb-6"
      activeOpacity={0.7}
      onPress={() => onPress(id)}
    >
      <View className="aspect-square items-center justify-center rounded-t-xl overflow-hidden">
        <Image
          source={{ uri: logo }}
          resizeMode="cover"
          className="w-full h-full"
        />
      </View>
      <View className="p-3">
        <CustomText
          variant='label'
          fontWeight="bold"
          numberOfLines={1}
        >
          {name}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
