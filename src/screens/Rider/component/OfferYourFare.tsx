import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, Image, StyleSheet, Pressable, Platform } from "react-native";
import { Feather, Entypo, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomText } from "@/components";
import PaymentBottomModal from "./PaymentBottomModal";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { useDispatch } from "react-redux";
import { clearRide, setRideHours } from "@/redux/slices/RideSlices/rideCreationSlice";
import { resetLocations } from "@/redux/slices/RideSlices/rideLocationSlice";

interface Props {
  visible: boolean;
  onClose: () => void;
  fareCheck?: boolean;
}

const OfferYourFare: React.FC<Props> = ({ visible, onClose, fareCheck }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [promoVisible, setPromoVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"standard" | "hourly">("standard");
  const [hours, setHours] = useState(1);
  const fromLocation = useSelector((state: RootState) => state.rideLocation.fromLocation);
  const toLocation = useSelector((state: RootState) => state.rideLocation.toLocation);
  const selectedRide = useSelector((state: RootState) => state.rideSelection.selectedRide);
  console.log("my selected Ride is ", selectedRide);
  const [fare, setFare] = useState("");
  const myRideFare = useSelector((state: RootState) => state.rideCreation.myRideFare)
const { currency } = useSelector((state: RootState) => state.appConfig);
  const recommendedFare = myRideFare || 56.7;

  const isBelowRecommended = fare !== "" && parseFloat(fare) < recommendedFare;


  const handleClose = () => {
    dispatch(clearRide());
    dispatch(resetLocations());
    onClose();
  }


  const increaseHours = () => setHours((prev) => prev + 1);


  const decreaseHours = () =>
    setHours((prev) => (prev > 1 ? prev - 1 : 1));

  console.log("fareCheck", fareCheck)



  useEffect(() => {
    dispatch(setRideHours(hours))
  }, [hours])


  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === "android" ? "fade" : "slide"}
      transparent={false}
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#DBD6FB', '#FEFEFF']}
        locations={[0, 0.5]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      />
      <View className="flex-1" style={{ paddingTop: insets.top }}>

        <View className="relative flex-row items-center justify-center px-4 py-3">
          <TouchableOpacity onPress={handleClose} className="mr-auto bg-[#F4F4F5] rounded-full p-2">
            <Feather name="x" size={22} color="#27272A" />
          </TouchableOpacity>

          <CustomText fontWeight="bold" className="absolute left-0 right-0 text-lg font-semibold text-center">
            Offer Your Fare
          </CustomText>


        </View>


        <View className="flex-1 p-6">

          {!fareCheck && (
            <View className="w-full flex-row bg-[#F4F4F5] rounded-full p-1">

              <Pressable
                onPress={() => setActiveTab("standard")}
                className={`flex-1 py-2 rounded-full items-center ${activeTab === "standard" ? "bg-white" : ""
                  }`}
              >
                <Text
                  className={`text-sm font-semibold ${activeTab === "standard" ? "text-black" : "text-gray-500"
                    }`}
                >
                  Standard
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab("hourly")}
                className={`flex-1 py-2 rounded-full items-center ${activeTab === "hourly" ? "bg-white" : ""
                  }`}
              >
                <Text
                  className={`text-sm font-semibold ${activeTab === "hourly" ? "text-black" : "text-gray-500"
                    }`}
                >
                  Hourly
                </Text>
              </Pressable>
            </View>
          )

          }

          {/* Tab Content */}
          <View className="my-5">
            {activeTab === "hourly" && (

              <View className="w-full py-2  flex-row items-center justify-between">


                <TouchableOpacity className="bg-[#FFFFFF] rounded-full p-2" onPress={decreaseHours}>
                  <AntDesign name="minus" size={20} color="#27272A" />
                </TouchableOpacity>

                <View className="items-center gap-2 py-2">
                  <CustomText lightColor="#3853A4" fontWeight="bold" fontSize="2xl" className="pt-2">
                    {hours} {hours > 1 ? "hours" : "hour"}
                  </CustomText>
                  <CustomText lightColor="#71717A" fontSize="sm">40 miles included</CustomText>
                </View>
                <TouchableOpacity className="bg-[#FFFFFF] rounded-full p-2" onPress={increaseHours}>
                  <AntDesign name="plus" size={20} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>



          <View className="flex-row items-center">
            <CustomText lightColor="black" fontSize="sm" fontWeight="normal">

              {fareCheck ? "You can change the recommended fare" : "Offer your fare"}

            </CustomText>
            <CustomText lightColor="#DC2626" fontSize="sm" fontWeight="normal">
              *
            </CustomText>
          </View>
          <CustomText className="mt-2" lightColor="#71717A" fontSize="sm" fontWeight="light">
            Recommended fare: {currency?.code} {recommendedFare}
          </CustomText>
          <TextInput
            placeholder="Enter your fare"
            keyboardType="numeric"
            value={fare}
            onChangeText={setFare}
            className={`w-full bg-white rounded-full px-4 py-4 shadow border mt-2 ${isBelowRecommended ? "border-red-500" : "border-gray-200"
              }`}
          />
          {isBelowRecommended && (
            <Text className="text-red-500 mt-1">
              Fare cannot be lower than {currency?.code} {recommendedFare}
            </Text>
          )}
          <View className="mt-auto">


            <TouchableOpacity className="flex-row items-center  justify-between mt-6" onPress={() => setPromoVisible(true)}>
              <View className="flex-row gap-1 items-center space-x-2">
                <Feather name="tag" size={20} color="black" />
                <CustomText lightColor="black" fontSize="sm" fontWeight="medium">
                  Promo Code
                </CustomText>
              </View>
              <Feather name="chevron-right" size={20} color="black" />
            </TouchableOpacity>


            <TouchableOpacity className="flex-row items-center justify-between mt-6" onPress={() => setPaymentVisible(true)}>

              <View className='flex-row gap-2 items-center'>
                <Image source={require("@/assets/images/cash.png")} className="w-8 h-8" resizeMode='contain' />

                <CustomText fontSize='sm'>Cash</CustomText>
              </View>
              <Entypo name="chevron-small-right" size={24} color="black" />
            </TouchableOpacity>

            <CustomText
              lightColor="#71717A"
              fontSize="xs"
              fontWeight="light"
              className="mt-6"
            >
              Your Current Trip
            </CustomText>

            <View className="mt-2 space-y-2 mb-5">
              <View className="flex-row gap-2 items-center">
                <Image
                  source={require("@/assets/images/fromIcon.png")}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <CustomText lightColor="black" fontSize="sm">
                  {fromLocation}
                </CustomText>
              </View>

              <View className="flex-row gap-2 items-center mt-3">
                <Image
                  source={require("@/assets/images/toIcon.png")}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <CustomText lightColor="black" fontSize="sm" >
                  {toLocation}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity className="bg-[#3853A4] rounded-full py-4 items-center" onPress={onClose}>
              <CustomText lightColor='white' fontWeight='medium' className="text-white text-base font-semibold">Next</CustomText>
            </TouchableOpacity>
          </View>




        </View>



        <PaymentBottomModal visible={promoVisible} onClose={() => setPromoVisible(false)} title="Promo Code" variant="promo" >
          <CustomText fontSize="sm" className="mb-2 mt-auto">Enter your promo code</CustomText>
          <TextInput
            placeholder="Promo code"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
          <TouchableOpacity className="mt-auto bg-[#3853A4] rounded-full py-3 items-center">
            <CustomText lightColor="white" fontWeight="medium">Use Promo</CustomText>
          </TouchableOpacity>
        </PaymentBottomModal>

        {/* Payment Modal */}
        <PaymentBottomModal visible={paymentVisible} onClose={() => setPaymentVisible(false)} title="Choose Payment Method">


          <TouchableOpacity className="bg-[#FAFAFA] py-4 p-2 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Image source={require("@/assets/images/cash.png")} className="w-8 h-8" resizeMode='contain' />
              <CustomText fontSize="sm" fontWeight="bold">Cash</CustomText>


            </View>
            <Feather name="check" size={20} color="black" />

          </TouchableOpacity>
          <TouchableOpacity className=" py-4 p-2 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <FontAwesome name="credit-card" size={24} color="black" />
              <CustomText fontSize="sm">Card</CustomText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="py-4 p-2 flex-row items-center gap-2">
            <AntDesign name="plus" size={24} color="black" />
            <CustomText fontSize="sm" fontWeight="medium">Add Payment Methods</CustomText>
          </TouchableOpacity>
        </PaymentBottomModal>




      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default OfferYourFare;
