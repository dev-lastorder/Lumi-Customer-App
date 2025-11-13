import React, { useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomText } from "@/components";
import { useDispatch } from "react-redux";
import { setScheduleRideTime } from "@/redux/slices/RideSlices/rideCreationSlice";

interface ScheduleRideModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const ScheduleRideModal: React.FC<ScheduleRideModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);


  const dispatch = useDispatch();

  const handleConfirm = (date: Date) => {
    const now = new Date();

    if (date <= now) {
      Alert.alert("Invalid Time", "Please select a future date and time.");
      hideDatePicker();
      return;
    }

    setSelectedDate(date);
    hideDatePicker();
  };


  const handleFinalConfirm = () => {
    if (selectedDate) {
      console.log("selected Date", selectedDate)
      onConfirm(selectedDate);
      dispatch(setScheduleRideTime(selectedDate.toISOString()));

    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <CustomText fontWeight="semibold" className="text-center">
            Schedule ride
          </CustomText>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#E5E7EB", marginTop: 20 }]}
            onPress={showDatePicker}
          >
            <CustomText>
              {selectedDate ? selectedDate.toLocaleString() : "Pick Date & Time"}
            </CustomText>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
          <View style={styles.actions}>

            <TouchableOpacity
              className={`bg-[#1691BF] w-full rounded-full py-3 ${!selectedDate ? "opacity-50" : "opacity-100"}`}
              onPress={handleFinalConfirm}
              disabled={!selectedDate}
            >
              <CustomText lightColor="white" className="text-center">Set pick up time</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ScheduleRideModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
