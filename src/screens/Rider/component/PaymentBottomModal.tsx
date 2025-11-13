// components/Pay.tsx
import React from "react";
import { Modal, View, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { CustomText } from "@/components";

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  variant?: "default" | "promo"; 
}

const PaymentBottomModal: React.FC<Props> = ({
  visible,
  onClose,
  children,
  title,
  variant = "default",
}) => {
  const insets = useSafeAreaInsets();

  const containerFlex = variant === "promo" ? 0.3 : 0.2;
 

  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === "android" ? "fade" : "slide"}
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="bg-white rounded-t-2xl p-6"
          style={{
            flex: containerFlex,
            paddingTop: insets.top / 2,
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 items-center">
              <CustomText fontWeight="medium">{title}</CustomText>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-gray-200 rounded-full p-1">
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default PaymentBottomModal;
