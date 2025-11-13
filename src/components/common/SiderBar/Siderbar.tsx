import React from "react";
import { View, TouchableOpacity, Animated, Dimensions, StyleSheet, Platform } from "react-native";
import { CustomText } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from '@expo/vector-icons/Entypo';
import { router } from "expo-router";

const { width } = Dimensions.get("window");

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
    activeBar?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, activeBar }) => {
    const translateX = React.useRef(new Animated.Value(-width)).current;
    const backdropOpacity = React.useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    const handleGoHome = () => {
        router.push("/home");
        onClose();
    };

    const handleDrive = () => {
        router.push("/customer-ride");
        onClose();
    };

    const handleReservation = () => {
        router.push("/ride-reservation");
        onClose();
    };

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: visible ? 0 : -width,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: visible ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [visible]);

    return (
        <View style={[styles.overlay]} pointerEvents={visible ? "auto" : "none"}>
            <Animated.View
                style={[styles.backdrop, { opacity: backdropOpacity }]}
                pointerEvents={visible ? "auto" : "none"}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    activeOpacity={1}
                />
            </Animated.View>

            <Animated.View 
                style={[styles.sidebar, { transform: [{ translateX }], paddingTop: insets.top + 10 }]} 
                pointerEvents={visible ? "auto" : "none"}
            >
                <TouchableOpacity className="flex-row gap-2 mb-4" onPress={handleGoHome}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                    <CustomText fontWeight="medium">Go to home</CustomText>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleDrive} 
                    className={`mb-4 flex-row gap-2 mt-5 rounded-xl px-2 py-2 items-center ${
                        activeBar === "lumiDrive" ? "bg-[#D3F2FA] py-5 items-center" : ""
                    }`}
                >
                    <MaterialCommunityIcons 
                        name="car-side" 
                        size={20} 
                        color={activeBar === 'lumiDrive' ? "#3853A4" : "black"} 
                    />
                    <CustomText 
                        fontSize="md" 
                        lightColor={activeBar === "lumiDrive" ? '#3853A4' : "#18181B"}
                    >
                        LUMIDrive
                    </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleReservation}
                    className={`mb-4 flex-row gap-2 mt-5 rounded-xl px-2 py-2 ${
                        activeBar === "reservation" ? "bg-[#D3F2FA] py-5" : ""
                    }`}
                >
                    <MaterialCommunityIcons 
                        name="calendar-clock-outline" 
                        size={20} 
                        color={activeBar === 'reservation' ? "#3853A4" : "black"} 
                    />
                    <CustomText lightColor={activeBar === "reservation" ? '#3853A4' : "#18181B"}>
                        Reservations
                    </CustomText>
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose} className="mb-7 flex-row gap-2 mt-5">
                    <Entypo name="back-in-time" size={24} color="black" />
                    <CustomText>Ride & courier history</CustomText>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    sidebar: {
        width: Platform.OS === 'ios' ? width * 0.8 : width * 0.7,
        backgroundColor: "white",
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
});