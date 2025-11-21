import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Keyboard,
    Dimensions,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Animated,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { CustomText } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { 
    useInitializeRideChat, 
    useSendMessage, 
    useGetMessages,
    useClearChatCache 
} from "@/hooks/chat/chatHooks";
import { 
    ChatMessage, 
    chatApi, 
    convertWebSocketMessage, 
    IReceivedMessage 
} from "@/services/api/chatApi";
import { useTwilioVoice } from "@/hooks/chat/useTwilioVoice";
import twilioService from "@/services/twilio.service";
import { useRouter } from "expo-router";
import DriverCallModal from "../RideAccepted/DriverCallModal";

const { height: screenHeight } = Dimensions.get('window');

interface Props {
    visible: boolean;
    onClose: () => void;
    onStartCall?: () => void;
    driverId: string;
    driverName: string;
    driverAvatar?: string;
}

// Persistent chat cache to maintain state across modal opens/closes
const chatCache = new Map<string, {
    chatBoxId: string | null;
    messages: ChatMessage[];
    isInitialized: boolean;
}>();

const RideChatIndex: React.FC<Props> = ({ 
    visible, 
    onClose,
    onStartCall,
    driverId,
    driverName,
    driverAvatar = "https://i.pravatar.cc/100?img=3"
}) => {
    
     const currentUserId = useSelector((state: RootState) => state.authSuperApp.user?.id);
    // const currentUserId = "89501c4c-e522-470a-9dcf-3bf24137ec77";
    console.log("currrent id is :", currentUserId)
    
    // Create unique cache key for this conversation
    const cacheKey = `${currentUserId}-${driverId}`;

    console.log("cache key", cacheKey)
    
    // Local state
    const [input, setInput] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [chatBoxId, setChatBoxId] = useState<string | null>(
        chatCache.get(cacheKey)?.chatBoxId || null
    );
    const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>(
        chatCache.get(cacheKey)?.messages || []
    );
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isInitialized, setIsInitialized] = useState(
        chatCache.get(cacheKey)?.isInitialized || false
    );
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    // Twilio Voice Hook
    const { makeCall, endCall, isCallActive, isConnecting } = useTwilioVoice(currentUserId);
    const router = useRouter();
    const [isCallingDriver, setIsCallingDriver] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false);

    // TanStack Query Hooks
    const { 
        data: chatData, 
        isLoading: isInitializing, 
        error: initError,
        isSuccess: isChatInitialized 
    } = useInitializeRideChat(currentUserId, driverId, visible && !!currentUserId && !isInitialized);

    const { 
        data: historyMessages = [], 
        isLoading: isLoadingMessages 
    } = useGetMessages(chatBoxId, !!chatBoxId);

    const { 
        mutate: sendMessage, 
        isPending: isSendingMessage,
        error: sendError 
    } = useSendMessage();

    const clearChatCache = useClearChatCache();

    // Combine and normalize all messages
    const allMessages = [
        ...(chatData?.messages || []).map(normalizeMessage),
        ...historyMessages.map(normalizeMessage),
        ...realtimeMessages.map(normalizeMessage)
    ].filter((message, index, array) => 
        array.findIndex(m => m.id === message.id || 
            (m.text === message.text && m.senderId === message.senderId && 
             Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000)
        ) === index
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Auto-scroll to bottom when modal opens and messages load
    useEffect(() => {
        if (visible && allMessages.length > 0) {
            // Small delay to ensure FlatList is rendered
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
                setIsNearBottom(true);
                setUnreadCount(0);
            }, 100);
        }
    }, [visible, allMessages.length > 0]);

    // Update chatBoxId and cache when chat is initialized
    useEffect(() => {
        if (isChatInitialized && chatData && !isInitialized) {
            const newChatBoxId = chatData.chatBox.id;
            setChatBoxId(newChatBoxId);
            setIsInitialized(true);
            
            // Update persistent cache
            chatCache.set(cacheKey, {
                chatBoxId: newChatBoxId,
                messages: chatData.messages || [],
                isInitialized: true
            });
        }
    }, [isChatInitialized, chatData, isInitialized, cacheKey]);

    // Update cache whenever messages change
    useEffect(() => {
        if (chatBoxId) {
            chatCache.set(cacheKey, {
                chatBoxId,
                messages: realtimeMessages,
                isInitialized: true
            });
        }
    }, [realtimeMessages, chatBoxId, cacheKey]);



    // WhatsApp-style keyboard handling with proper animations
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setIsKeyboardVisible(true);
            }
        );
        
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
                setIsKeyboardVisible(false);
            }
        );

        return () => {
            keyboardWillShowListener?.remove();
            keyboardWillHideListener?.remove();
        };
    }, [isNearBottom]);

    // WebSocket real-time message listener with CORRECT filtering
    useEffect(() => {
        if (!visible || !currentUserId || !driverId) return;

        console.log('🔌 Setting up WebSocket listeners for chat');
        
        const unsubscribeMessages = chatApi.onMessageReceived((wsMessage: IReceivedMessage) => {
            console.log('📥 Received WebSocket message:', wsMessage);
            
            // Only show messages that are part of THIS specific conversation
            const isRelevantMessage = (
                (wsMessage.sender === driverId && wsMessage.receiver === currentUserId) ||
                (wsMessage.sender === currentUserId && wsMessage.receiver === driverId)
            );
            
            if (isRelevantMessage) {
                console.log('✅ Message is for this conversation');
                const chatMessage = convertWebSocketMessage(wsMessage, chatBoxId || undefined);
                
                setRealtimeMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(msg => msg.id === chatMessage.id)) return prev;
                    const updated = [...prev, chatMessage];
                    
                    // Update cache
                    chatCache.set(cacheKey, {
                        chatBoxId,
                        messages: updated,
                        isInitialized: true
                    });
                    
                    return updated;
                });
                
                // Auto-scroll for new messages (WhatsApp behavior)
                if (isNearBottom) {
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                } else {
                    // User is scrolled up, increment unread count
                    setUnreadCount(prev => prev + 1);
                }
            } else {
                console.log('❌ Message not for this conversation');
            }
        });

        const unsubscribeConnection = chatApi.onConnectionChange((connected: boolean) => {
            console.log('🔌 WebSocket connection status:', connected);
            setIsSocketConnected(connected);
        });

        setIsSocketConnected(chatApi.isSocketConnected());

        return () => {
            console.log('🧹 Cleaning up WebSocket listeners');
            unsubscribeMessages();
            unsubscribeConnection();
        };
    }, [visible, currentUserId, driverId, chatBoxId, cacheKey, isNearBottom]);

    // Handle send message with proper scroll behavior
    const handleSendMessage = useCallback((msg?: string) => {
        const text = msg || input.trim();
        if (!text || isSendingMessage || !currentUserId) return;

        console.log('📤 Sending message:', text);
        
        sendMessage({
            senderId: currentUserId,
            receiverId: driverId,
            text,
        }, {
            onSuccess: () => {
                setInput("");
                console.log('✅ Message sent successfully');
                
                // Always scroll to bottom after sending (WhatsApp behavior)
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 50);
            },
            onError: (error: any) => {
                Alert.alert('Error', 'Failed to send message. Please try again.');
                console.error('❌ Send message error:', error);
            }
        });
    }, [input, isSendingMessage, currentUserId, driverId, sendMessage]);

    // Handle scroll to bottom (WhatsApp-style)
    const scrollToBottom = useCallback(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
        setUnreadCount(0);
    }, []);

    // Track scroll position to determine auto-scroll behavior (WhatsApp pattern)
    const handleScroll = useCallback((event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 50;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
            contentSize.height - paddingToBottom;
        
        setIsNearBottom(isCloseToBottom);
        
        // Reset unread count when user scrolls back to bottom
        if (isCloseToBottom && unreadCount > 0) {
            setUnreadCount(0);
        }
        
        // Dismiss keyboard on scroll only if scrolling up (WhatsApp behavior)
        if (isKeyboardVisible && contentOffset.y > 0) {
            const scrollDirection = contentOffset.y > (event.nativeEvent.previousOffset?.y || 0);
            if (!scrollDirection) {
                Keyboard.dismiss();
            }
        }
    }, [isKeyboardVisible, unreadCount]);

    // Normalize message format
    function normalizeMessage(message: any): ChatMessage {
        return {
            ...message,
            senderId: message.senderId || message.sender_id,
            receiverId: message.receiverId || message.receiver_id,
        };
    }

    // Handle call button press
    const handleCallPress = async () => {
        if (isCallingDriver) return;
        
        setIsCallingDriver(true);
        try {
            console.log('📞 Calling driver:', driverId);
            await twilioService.makeCall(driverId);
            
            // Show call modal
            setShowCallModal(true);
        } catch (error) {
            console.error('Failed to call driver:', error);
            Alert.alert('Call Failed', 'Unable to call driver. Please try again.');
        } finally {
            setIsCallingDriver(false);
        }
        
        // Also call the original callback if provided
        if (onStartCall) {
            onStartCall();
        }
    };

    // Handle call modal close
    const handleCallModalClose = () => {
        setShowCallModal(false);
    };

    // Show error if user not logged in
    if (!currentUserId) {
        return (
            <Modal visible={visible} transparent onRequestClose={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Please log in to use chat</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    if (initError) {
        return (
            <Modal visible={visible} transparent onRequestClose={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Failed to load chat</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    const quickReplies = ["I'm here", "Hello", "Call me when you arrive", "Where are you?"];

    return (
        <Modal 
            visible={visible} 
            animationType="slide" 
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView 
                    style={[styles.modalContainer, { height: screenHeight * 0.8 }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    {/* Header - STAYS FIXED */}
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                                <Ionicons name="chevron-down" size={24} color="black" />
                            </TouchableOpacity>

                            <View style={styles.driverInfo}>
                                <Image
                                    source={{ uri: driverAvatar }}
                                    style={styles.driverAvatar}
                                />
                                <View>
                                    <CustomText fontWeight="medium">{driverName}</CustomText>
                                    <View style={styles.statusContainer}>
                                        <View style={[
                                            styles.statusDot, 
                                            { backgroundColor: isSocketConnected ? '#10B981' : '#EF4444' }
                                        ]} />
                                        <Text style={styles.statusText}>
                                            {isSocketConnected ? 'Online' : 'Connecting...'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.callButton, isCallingDriver && styles.callButtonActive]}
                            onPress={handleCallPress}
                            disabled={isCallingDriver}
                        >
                            {isCallingDriver ? (
                                <ActivityIndicator size="small" color="#EF4444" />
                            ) : (
                                <Ionicons 
                                    name="call-outline" 
                                    size={22} 
                                    color={isCallingDriver ? "#EF4444" : "black"} 
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Loading state while initializing */}
                    {(isInitializing && !isInitialized) ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3853A4" />
                            <Text style={styles.loadingText}>Loading chat...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Messages Area - ADJUSTS TO KEYBOARD */}
                            <View style={styles.messagesContainer}>
                                <FlatList
                                    ref={flatListRef}
                                    data={allMessages}
                                    keyExtractor={(item) => item.id}
                                    style={styles.messagesList}
                                    contentContainerStyle={{ paddingBottom: 10 }}
                                    keyboardShouldPersistTaps="handled"
                                    keyboardDismissMode="interactive"
                                    onScroll={handleScroll}
                                    scrollEventThrottle={16}
                                    renderItem={({ item }) => {
                                        const isMyMessage = item.senderId === currentUserId;
                                        
                                        return (
                                            <View style={[
                                                styles.messageBox,
                                                isMyMessage ? styles.userMessage : styles.driverMessage
                                            ]}>
                                                <Text style={[
                                                    styles.messageText,
                                                    { color: isMyMessage ? "white" : "black" }
                                                ]}>{item.text}</Text>
                                                <Text style={[
                                                    styles.messageTime,
                                                    { color: isMyMessage ? "#E0E7FF" : "#6B7280" }
                                                ]}>
                                                    {new Date(item.createdAt).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    onContentSizeChange={() => {
                                        if (isNearBottom && !isKeyboardVisible) {
                                            setTimeout(() => {
                                                flatListRef.current?.scrollToEnd({ animated: true });
                                            }, 50);
                                        }
                                    }}
                                />
                                
                                {/* Scroll to Bottom Button (WhatsApp-style) */}
                                {!isNearBottom && (
                                    <TouchableOpacity 
                                        style={styles.scrollToBottomButton}
                                        onPress={scrollToBottom}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="chevron-down" size={20} color="#3853A4" />
                                        {unreadCount > 0 && (
                                            <View style={styles.unreadBadge}>
                                                <Text style={styles.unreadCount}>
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Quick Replies - MOVES WITH KEYBOARD */}
                            {!isKeyboardVisible && (
                                <View style={styles.quickRepliesContainer}>
                                    <FlatList
                                        horizontal
                                        data={quickReplies}
                                        keyExtractor={(reply) => reply}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => handleSendMessage(item)}
                                                style={styles.quickReplyButton}
                                                disabled={isSendingMessage}
                                            >
                                                <Text style={styles.quickReplyText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}

                            {/* Input Area - DOCKED TO KEYBOARD TOP */}
                            <View style={[
                                styles.inputContainer,
                                { 
                                    paddingBottom: Math.max(insets.bottom, 8),
                                }
                            ]}>
                                <TouchableOpacity style={styles.cameraButton}>
                                    <Feather name="camera" size={24} color="black" />
                                </TouchableOpacity>

                                <TextInput
                                    value={input}
                                    onChangeText={setInput}
                                    placeholder="Type a message..."
                                    style={styles.textInput}
                                    multiline
                                    maxLength={500}
                                    editable={!isSendingMessage}
                                    returnKeyType="send"
                                    enablesReturnKeyAutomatically={true}
                                    onSubmitEditing={() => {
                                        if (input.trim()) {
                                            handleSendMessage();
                                        }
                                    }}
                                    blurOnSubmit={false}
                                />

                                <TouchableOpacity 
                                    onPress={() => handleSendMessage()} 
                                    style={[styles.sendButton, { opacity: isSendingMessage ? 0.5 : 1 }]}
                                    disabled={isSendingMessage || !input.trim()}
                                >
                                    {isSendingMessage ? (
                                        <ActivityIndicator size="small" color="#3853A4" />
                                    ) : (
                                        <Ionicons name="send" size={24} color="#3853A4" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </KeyboardAvoidingView>
            </View>
            
            {/* Call Modal */}
            <DriverCallModal
                visible={showCallModal}
                onClose={handleCallModalClose}
                driverName={driverName}
                driverAvatar={driverAvatar}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 8,
    },
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F4F4F5',
        backgroundColor: 'white',
        zIndex: 1,
    },
    
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    driverAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },

    statusText: {
        fontSize: 12,
        color: '#6B7280',
    },
    
    callButton: {
        backgroundColor: '#F4F4F5',
        padding: 8,
        borderRadius: 20,
    },

    callButtonActive: {
        backgroundColor: '#FEE2E2',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },

    errorContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 12,
        alignItems: 'center',
    },

    errorText: {
        fontSize: 16,
        color: '#EF4444',
        marginBottom: 16,
        textAlign: 'center',
    },

    closeButton: {
        backgroundColor: '#F4F4F5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },

    closeButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    
    messagesList: {
        flex: 1,
    },
    
    messageBox: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
    },
    
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3853A4',
    },
    
    driverMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F4F4F5',
    },
    
    messageText: {
        fontSize: 16,
        marginBottom: 4,
        lineHeight: 22,
    },

    messageTime: {
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    
    quickRepliesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F4F4F5',
        backgroundColor: 'white',
    },
    
    quickReplyButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1691BF',
        marginRight: 8,
    },
    
    quickReplyText: {
        color: '#1691BF',
        fontSize: 14,
    },
    
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F4F4F5',
    },
    
    cameraButton: {
        marginRight: 8,
        padding: 8,
    },
    
    textInput: {
        flex: 1,
        backgroundColor: '#F4F4F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 100,
        fontSize: 16,
        lineHeight: 20,
    },
    
    sendButton: {
        marginLeft: 8,
        padding: 8,
    },

    scrollToBottomButton: {
        position: 'absolute',
        right: 16,
        bottom: 20,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    unreadBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#EF4444',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },

    unreadCount: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default RideChatIndex;