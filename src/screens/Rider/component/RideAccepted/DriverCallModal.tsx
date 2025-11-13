import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTwilioVoice } from '@/hooks/chat/useTwilioVoice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import twilioService from '@/services/twilio.service';
interface DriverCallModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  driverName?: string;
  driverAvatar?: string;
  isConnecting?: boolean;
  isConnected?: boolean;
}
const DriverCallModal: React.FC<DriverCallModalProps> = ({
  visible,
  onClose,
  onBack,
  driverName = "Driver",
  driverAvatar,
  isConnecting = false,
  isConnected = false
}) => {
  const insets = useSafeAreaInsets();
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'disconnected'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  
  const currentUserId = useSelector((state: RootState) => state.authSuperApp.user?.id);
  const profileImage = driverAvatar || "https://avatar.iran.liara.run/public/48";
  // Setup Twilio call listeners
  useEffect(() => {
    if (!visible) return;

    // Call connected listener
    twilioService.onCallConnected = (call) => {
      console.log('📞 Call connected in modal');
      setCallStatus('connected');
    };

    // Call ringing listener
    twilioService.onCallRinging = (call) => {
      console.log('📲 Call ringing in modal');
      setCallStatus('ringing');
    };

    // Call disconnected listener
    twilioService.onCallDisconnected = (call, error) => {
      console.log('📴 Call disconnected in modal');
      setCallStatus('disconnected');
      onClose();
    };

    // Call failed listener
    twilioService.onCallFailed = (call, error) => {
      console.log('❌ Call failed in modal:', error);
      setCallStatus('disconnected');
      onClose();
    };

    return () => {
      // Clean up listeners when modal closes
      twilioService.onCallConnected = null;
      twilioService.onCallRinging = null;
      twilioService.onCallDisconnected = null;
      twilioService.onCallFailed = null;
    };
  }, [visible, onClose]);

  // Call duration timer
  useEffect(() => {
    let interval: number;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const handleToggleMute = async () => {
    try {
      const newMutedState = await twilioService.toggleMute();
      setIsMuted(newMutedState);
      console.log('🔇 Mute toggled:', newMutedState);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const handleEndCall = async () => {
    console.log('[CALL MODAL] Ending call');
    try {
      await twilioService.disconnect();
    } catch (error) {
      console.error('Error ending call:', error);
    }
    onClose();
  };

  const handleToggleSpeaker = () => {
    // Toggle speaker state (Twilio handles this automatically on mobile)
    setIsSpeakerOn(!isSpeakerOn);
    console.log('🔊 Speaker toggled:', !isSpeakerOn);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const getCallStatus = () => {
    switch (callStatus) {
      case 'connecting': return "Connecting...";
      case 'ringing': return "Ringing...";
      case 'connected': return "Connected";
      case 'disconnected': return "Call Ended";
      default: return "Calling...";
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleEndCall}
    >
      <GradientBackground>
        <View style={[styles.container, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 80 }]}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <Text style={styles.nameText}>{driverName}</Text>
            {/* Dynamic Status */}
            <View style={styles.statusContainer}>
              {(callStatus === 'connecting' || callStatus === 'ringing') && (
                <ActivityIndicator size="small" color="#1691BF" style={{ marginRight: 8 }} />
              )}
              <Text style={[
                styles.statusText,
                callStatus === 'connected' && styles.statusConnected
              ]}>
                {getCallStatus()}
              </Text>
            </View>
            {/* Call Duration Timer */}
            {callStatus === 'connected' && (
              <Text style={styles.durationText}>
                {formatDuration(callDuration)}
              </Text>
            )}
          </View>
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Mute Button */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                isMuted && styles.iconButtonActive
              ]}
              onPress={handleToggleMute}
              disabled={callStatus !== 'connected'}
            >
              <Ionicons
                name={isMuted ? "mic-off" : "mic"}
                size={28}
                color={isMuted ? "#DC2626" : "#52525B"}
              />
            </TouchableOpacity>
            {/* End Call Button */}
            <TouchableOpacity
              style={styles.endCallButton}
              onPress={handleEndCall}
            >
              <Ionicons
                name="call"
                size={32}
                color="#fff"
                style={{ transform: [{ rotate: '135deg' }] }}
              />
            </TouchableOpacity>
            {/* Speaker Button */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                isSpeakerOn && styles.iconButtonActive
              ]}
              onPress={handleToggleSpeaker}
              disabled={callStatus !== 'connected'}
            >
              <Ionicons
                name={isSpeakerOn ? "volume-high" : "volume-high-outline"}
                size={28}
                color={isSpeakerOn ? "#1691BF" : "#52525B"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    </Modal>
  );
};
export default DriverCallModal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  nameText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    color: "#71717A",
    fontWeight: "400",
  },
  statusConnected: {
    color: "#16A34A", // Green when connected
    fontWeight: "600",
  },
  durationText: {
    fontSize: 14,
    color: "#A1A1AA",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E4E4E7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButtonActive: {
    backgroundColor: "#FEE2E2", // Light red when muted
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});