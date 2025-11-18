
import { RootState } from "@/redux";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const { height } = Dimensions.get("window");

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; comment: string }) => void;
    rideData: any;
    loading:boolean
}

const RatingModal: React.FC<RatingModalProps> = ({
    visible,
    onClose,
    onSubmit,
    rideData,
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(80);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const onGoingRideData = useSelector(
        (state: RootState) => state.activeRide.onGoingActiveRideData
    );

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setKeyboardVisible(true);
            }
        );
        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setKeyboardHeight(80);
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1, justifyContent: "flex-end" }}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View
                            style={[
                                styles.modalCard,
                                {
                                    paddingBottom:
                                        Platform.OS === "android"
                                            ? keyboardHeight + insets.bottom
                                            : 0
                                },
                            ]}
                        >
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>

                            <Text style={styles.title}>You have arrived</Text>

                            <Image
                                source={{
                                    uri:
                                        rideData?.passenger_profileImage ||
                                        onGoingRideData?.passengerUser?.profile_image ||
                                        "https://i.pravatar.cc/150",
                                }}
                                style={styles.profileImage}
                            />

                            <View style={styles.starRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Text style={styles.star}>
                                            {star <= rating ? "⭐" : "☆"}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput
                                style={styles.commentBox}
                                placeholder="Leave a comment..."
                                value={comment}
                                onChangeText={setComment}
                                multiline
                            />

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    { backgroundColor: "#3853A4" },
                                ]}
                                onPress={() => onSubmit({ rating, comment })}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default RatingModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalCard: {
        minHeight: height * 0.5,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 20,
    },
    starRow: {
        flexDirection: "row",
        marginBottom: 20,
    },
    star: {
        fontSize: 35,
        marginHorizontal: 5,
    },
    commentBox: {
        width: "100%",
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: "top",
    },
    button: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 20,
        padding: 6,
    },
    closeIcon: {
        fontSize: 18,
        color: "#333",
        fontWeight: "600",
    },
});
