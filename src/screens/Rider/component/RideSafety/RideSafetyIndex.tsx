import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  SafeAreaView,
  Share,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome, MaterialCommunityIcons, EvilIcons, FontAwesome5, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText } from '@/components';
import { supportChatApi, SupportChatMessage, convertWebSocketToSupportMessage, IReceivedMessage } from '@/services/api/supportChatApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import EmergencyContactSvg from '@/assets/svg/contact-1';
import { useTwilioVoice } from '@/hooks/chat/useTwilioVoice';

interface RideSafetyIndexProps {
  visible: boolean;
  onClose: () => void;
  rideData: any
}

const SUPPORT_ID = 'fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea';

const RideSafetyIndex: React.FC<RideSafetyIndexProps> = ({ visible, onClose, rideData }) => {
  const currentUserId = useSelector((state: RootState) => state.authSuperApp.user?.id);

  // State to toggle between views
  const [showSupport, setShowSupport] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  // Support chat states
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatBoxId, setChatBoxId] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  // Twilio Voice Hook
  const { makeCall, endCall, isCallActive, isConnecting } = useTwilioVoice(currentUserId);
  const { emergencyContact } = useSelector((state: RootState) => state.appConfig);
  // Initialize support chat when switching to support view
  useEffect(() => {
    if (showSupport && currentUserId && visible) {
      initializeChat();
    }
  }, [showSupport, currentUserId, visible]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setShowSupport(false);
      setShowEmergencyContacts(false);
      setMessages([]);
      setInputText('');
      setChatBoxId('');
    }
  }, [visible]);

  const initializeChat = async () => {
    try {
      setLoading(true);

      if (!currentUserId) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      // Connect to WebSocket if not already connected
      const isConnected = supportChatApi.isSocketConnected();
      if (!isConnected) {
        await supportChatApi.connectToSocket(currentUserId);
      }

      // Initialize support chat
      const { chatBox, messages: chatMessages } = await supportChatApi.initializeSupportChat(currentUserId, SUPPORT_ID);

      setChatBoxId(chatBox.id);
      setMessages(chatMessages);

      // Subscribe to incoming WebSocket messages
      const unsubscribe = supportChatApi.onMessageReceived((wsMessage: IReceivedMessage) => {
        if (
          (wsMessage.sender === SUPPORT_ID && wsMessage.receiver === currentUserId) ||
          (wsMessage.sender === currentUserId && wsMessage.receiver === SUPPORT_ID)
        ) {
          const newMessage = convertWebSocketToSupportMessage(wsMessage, chatBox.id);
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      setLoading(false);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Failed to initialize support chat:', error);
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && showSupport) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, showSupport]);

  const handleSend = async () => {
    if (inputText.trim().length === 0 || !currentUserId) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      const sentMessage = await supportChatApi.sendMessage({
        senderId: currentUserId,
        receiverId: SUPPORT_ID,
        text: messageText,
      });

      setMessages((prev) => [...prev, sentMessage]);
    } catch (error) {
      console.error('Failed to send support message:', error);
    }
  };

  const handleShare = async () => {
    try {
      const latitude = 25.276987;
      const longitude = 55.296249;
      const rideLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      await Share.share({
        message: `🚖 I'm on a ride! Track me live: ${rideLink}`,
      });
    } catch (error) {
      console.log('Error sharing ride:', error);
    }
  };

  const handleBackFromSupport = () => {
    setShowSupport(false);
    setMessages([]);
    setInputText('');
  };

  const handleBackFromEmergencyContacts = () => {
    setShowEmergencyContacts(false);
  };

  const handleAddContact = () => {
    // TODO: Implement contact picker functionality
    console.log('Add contact pressed');
  };

  // Handle call button press in support chat
  const handleCallPress = () => {
    if (isCallActive) {
      Alert.alert('End Call', 'Do you want to end the current call?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Call', onPress: endCall, style: 'destructive' },
      ]);
    } else {
      makeCall();
    }
  };

  const renderMessage = ({ item }: { item: SupportChatMessage }) => {
    const isCurrentUser = item.senderId === currentUserId;

    return (
      <View className={`mb-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[75%] rounded-2xl px-4 py-3 ${isCurrentUser ? 'bg-[#7C3AED]' : 'bg-[#F3F4F6]'}`}>
          <CustomText fontSize="sm" lightColor={isCurrentUser ? '#FFFFFF' : '#000000'}>
            {item.text}
          </CustomText>
          <CustomText fontSize="xs" lightColor={isCurrentUser ? '#E9D5FF' : '#71717A'} className="mt-1">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </CustomText>
        </View>
      </View>
    );
  };

  // EMERGENCY CONTACTS VIEW
  const renderEmergencyContacts = () => (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-6">
        <TouchableOpacity onPress={handleBackFromEmergencyContacts} className="w-9 h-9 rounded-full bg-white shadow-sm justify-center items-center">
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        <View className="flex-1 items-center pr-9">
          <CustomText fontWeight="semibold" fontSize="lg">
            Emergency contacts
          </CustomText>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 justify-between px-5">
        <View className="flex-1 items-center justify-center">
          {/* Illustration */}
          <View className="items-center mb-8">
            <EmergencyContactSvg />
          </View>

          {/* Description text */}
          <CustomText fontSize="sm" lightColor="#71717A" className="text-center px-8">
            Please add up to 5 emergency contacts. We'll reach out to them in case of an emergency.
          </CustomText>
        </View>

        {/* Add contact button */}
        <View className="pb-8">
          <TouchableOpacity onPress={handleAddContact} className="rounded-full py-4 items-center" style={{ backgroundColor: '#3853A4' }}>
            <CustomText lightColor="white" fontWeight="semibold">
              Add contact
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // SUPPORT CHAT VIEW
  const renderSupportChat = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1" keyboardVerticalOffset={0}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
        <TouchableOpacity onPress={handleBackFromSupport} className="w-9 h-9 rounded-full bg-white shadow-sm justify-center items-center">
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <CustomText fontWeight="semibold" fontSize="lg">
            Support
          </CustomText>
          <CustomText fontSize="xs" lightColor="#71717A" className="mt-1">
            We're here to help
          </CustomText>
        </View>

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white shadow-sm justify-center items-center"
          onPress={handleCallPress}
          disabled={isConnecting}
          style={isCallActive ? { backgroundColor: '#FEE2E2' } : {}}
        >
          {isConnecting ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Feather name="phone" size={18} color={isCallActive ? '#EF4444' : 'black'} />
          )}
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <CustomText fontSize="sm" lightColor="#71717A">
                Start a conversation with our support team
              </CustomText>
            </View>
          }
        />
      )}

      {/* Input Area */}
      <View className="px-5 pb-5 bg-white border-t border-gray-100">
        <View className="flex-row items-center bg-[#F3F4F6] rounded-full px-4 py-2 mt-3">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#71717A"
            className="flex-1 text-base py-2"
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={inputText.trim().length === 0 || loading}
            className={`ml-2 w-8 h-8 rounded-full items-center justify-center ${inputText.trim().length > 0 && !loading ? 'bg-[#7C3AED]' : 'bg-gray-300'
              }`}
          >
            <Ionicons name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  // SAFETY FEATURES VIEW
  const renderSafetyFeatures = () => (
    <>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pt-4 pb-6">
          <TouchableOpacity onPress={onClose} className="w-9 h-9 rounded-full bg-white shadow-sm justify-center items-center">
            <Ionicons name="close" size={20} color="black" />
          </TouchableOpacity>

          <CustomText fontWeight="semibold" fontSize="lg">
            Safety features
          </CustomText>

          <View className="w-9 h-9" />
        </View>

        {/* Top action cards */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity className="bg-[#F3F4F6] rounded-xl p-4 w-[110px] h-28 justify-center" onPress={handleShare}>
            <Feather name="share" size={22} color="black" />
            <CustomText fontSize="xs" fontWeight="semibold" className="mt-2">
              Share my ride
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#F3F4F6] rounded-xl p-4 w-[110px] h-28 justify-center" onPress={() => setShowSupport(true)}>
            <Image source={require('@/assets/images/messages-square.png')} className="w-6 h-6" />
            <CustomText fontSize="xs" fontWeight="semibold" className="mt-2">
              Support
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#F3F4F6] rounded-xl p-4 w-[110px] h-28 justify-center" onPress={() => setShowEmergencyContacts(true)}>
            <Ionicons name="people-outline" size={22} color="black" />
            <CustomText fontSize="xs" fontWeight="semibold" className="mt-2">
              Emergency contacts
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Call button */}
        <TouchableOpacity className="bg-[#DC2626] rounded py-3 items-center mb-6 flex-row justify-center gap-2">
          <MaterialCommunityIcons name="alarm-light-outline" size={22} color="#ffff" />
          <CustomText lightColor="white" fontWeight="semibold">
            Call {emergencyContact}
          </CustomText>
        </TouchableOpacity>

        {/* Driver section */}
        <CustomText fontWeight="semibold" fontSize="lg" className="mb-4 mt-4">
          Driver's verifications
        </CustomText>

        <View className="flex-row items-center gap-4 mb-4">
          <Image
            source={{
              uri: rideData?.driver?.user?.profile || 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            className="w-16 h-16 rounded-full"
          />

          <View className="flex-1">
            <CustomText fontSize="sm">{rideData?.driver?.user?.name || 'John Doe'}</CustomText>
            <CustomText lightColor="#71717A" fontSize="xs" className="mt-1">
              ⭐ {rideData?.averageRating}
            </CustomText>
            <CustomText lightColor="#71717A" fontSize="xs" className="mt-1">
              {rideData?.vehicle?.plate_number}
            </CustomText>
          </View>
        </View>

        {/* Verification list */}
        <View className="px-3 py-2 mb-6">
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center gap-3">
              <FontAwesome5 name="address-card" size={20} color="black" />
              <CustomText fontSize="sm">Driver license validated</CustomText>
            </View>
            {rideData?.driver?.license_valid ? (
              <EvilIcons name="check" size={24} color="#047857" />
            ) : (
              <AntDesign name="closecircleo" size={20} color="#DC2626" />
            )}
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center gap-3">
              <SimpleLineIcons name="camera" size={20} color="black" />
              <CustomText fontSize="sm">Photocontrol completed</CustomText>
            </View>
            {rideData?.driver?.photcontrol_complete ? (
              <EvilIcons name="check" size={24} color="#047857" />
            ) : (
              <AntDesign name="closecircleo" size={20} color="#DC2626" />
            )}
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <FontAwesome5 name="user-circle" size={20} color="black" />
              <CustomText fontSize="sm">Selfie with driver license</CustomText>
            </View>
            {rideData?.driver?.selfie ? (
              <EvilIcons name="check" size={24} color="#047857" />
            ) : (
              <AntDesign name="closecircleo" size={20} color="#DC2626" />
            )}
          </View>
        </View>

        {/* How you're protected */}
        <CustomText fontSize="lg" fontWeight="semibold" className="mb-4">
          How you're protected
        </CustomText>

        <View className="flex-row flex-wrap -mx-2">
          {[
            'Proactive safety support',
            'Drivers verification',
            'Protecting your privacy',
            'Staying safe on every ride',
            'Accidents: Steps to take',
          ].map((title, idx) => (
            <View key={idx} className="w-1/2 px-2 mb-3">
              <View className="bg-[#F4F4F5] rounded h-24 p-4">
                <CustomText fontSize="sm">{title}</CustomText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl h-[100%] overflow-hidden">
          <LinearGradient
            colors={['#DBD6FB', '#FEFEFF']}
            locations={[0, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView className="flex-1">
            {/* Conditionally render views based on state */}
            {showEmergencyContacts ? renderEmergencyContacts() : showSupport ? renderSupportChat() : renderSafetyFeatures()}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default RideSafetyIndex;
