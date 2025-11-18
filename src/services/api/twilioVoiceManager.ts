import { Voice, Call, CallInvite } from '@twilio/voice-react-native-sdk';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@/environment';

const BACKEND_URL = BASE_URL; 
// const BACKEND_URL = 'http://192.168.18.32:3000'
const TOKEN_STORAGE_KEY = '@twilio_voice_token';
const TOKEN_EXPIRY_KEY = '@twilio_voice_token_expiry';

class TwilioVoiceManager {
  private static instance: TwilioVoiceManager;
  private voice: Voice | null = null;
  private activeCall: Call | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private isRegistered = false;
  private listeners: Set<(isActive: boolean, isConnecting: boolean) => void> = new Set();

  private constructor() {}

  static getInstance(): TwilioVoiceManager {
    if (!TwilioVoiceManager.instance) {
      TwilioVoiceManager.instance = new TwilioVoiceManager();
    }
    return TwilioVoiceManager.instance;
  }

  subscribe(listener: (isActive: boolean, isConnecting: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(isActive: boolean, isConnecting: boolean) {
    this.listeners.forEach(listener => listener(isActive, isConnecting));
  }

  async initialize(userId: string) {
    if (this.isInitialized || this.isInitializing || !userId) return;

    this.isInitializing = true;

    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        console.error('Microphone permission denied');
        this.isInitializing = false;
        return;
      }

      this.voice = new Voice();

      this.voice.on(Voice.Event.CallInvite, this.handleCallInvite);
      this.voice.on(Voice.Event.Registered, () => {
        console.log('✅ Voice SDK registered');
        this.isRegistered = true;
      });
      this.voice.on(Voice.Event.Error, (error: any) => {
        if (error.message?.includes('PushKit')) {
          console.log('ℹ️ PushKit not configured (incoming calls unavailable in background)');
          return;
        }
        console.error('❌ Voice SDK error:', error);
        this.isRegistered = false;
      });
      this.voice.on(Voice.Event.Unregistered, () => {
        console.log('Voice SDK unregistered');
        this.isRegistered = false;
      });

      const token = await this.getToken(userId);
      if (token && this.voice) {
        if (Platform.OS === 'ios') {
          await this.voice.initializePushRegistry();
        }

        try {
          await this.voice.register(token);
        } catch (regError) {
          console.warn('Registration failed (continuing for outgoing calls):', regError);
        }

        this.isInitialized = true;
        console.log('✅ Twilio Voice Manager initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Voice SDK:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  private async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone for voice calls',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  }

  private async getToken(userId: string): Promise<string | null> {
    try {
      // Check cached token
      const cachedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const expiryStr = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);

      if (cachedToken && expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (expiry > Date.now() + 5 * 60 * 1000) {
          console.log('✅ Using cached token');
          return cachedToken;
        }
      }

      // Fetch new token
      console.log('🔄 Fetching new token');
      const response = await axios.get(`${BACKEND_URL}/test/twilio/token`, {
        params: { identity: userId }
      });

      const { token } = response.data;
      if (!token) throw new Error('No token received');

      // Cache token for 55 minutes
      const expiry = Date.now() + 55 * 60 * 1000;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());

      return token;
    } catch (error: any) {
      console.error('Failed to get token:', error.response?.data || error.message);
      return null;
    }
  }

  private handleCallInvite = (callInvite: CallInvite) => {
    Alert.alert(
      'Incoming Call',
      `Call from ${callInvite.getFrom()}`,
      [
        {
          text: 'Reject',
          onPress: () => callInvite.reject(),
          style: 'cancel'
        },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const call = await callInvite.accept();
              this.activeCall = call;
              this.setupCallListeners(call);
            } catch (error) {
              console.error('Failed to accept call:', error);
            }
          }
        }
      ]
    );
  };

  private setupCallListeners(call: Call) {
    call.on(Call.Event.Connected, () => {
      console.log('📞 Call connected');
      this.notifyListeners(true, false);
    });

    call.on(Call.Event.Disconnected, () => {
      console.log('📞 Call disconnected');
      this.activeCall = null;
      this.notifyListeners(false, false);
    });

    call.on(Call.Event.ConnectFailure, (error: any) => {
      console.error('❌ Call failed:', error);
      this.activeCall = null;
      this.notifyListeners(false, false);
      Alert.alert('Call Failed', error.message || 'Failed to connect call');
    });

    call.on(Call.Event.Ringing, () => {
      console.log('📞 Call ringing...');
    });
  }

// twilioVoiceManager.ts - Line 156
async makeCall(userId: string, recipientPhone: string = '+923227385813') {  // ✅ Default hardcoded
    if (!this.voice || !this.isInitialized) {
      Alert.alert('Not Ready', 'Voice service is initializing. Please wait a moment.');
      return;
    }
  
    if (this.activeCall) {
      Alert.alert('Call in Progress', 'Please end the current call first');
      return; 
    }
  
    try {
      this.notifyListeners(false, true);
  
      const token = await this.getToken(userId);
      if (!token) throw new Error('Failed to get access token');
  
      console.log('📞 Initiating call to:', recipientPhone);
  
      const call = await this.voice.connect(token, {
        params: { To: recipientPhone }  // ✅ Just pass the phone number
      });
  
      this.activeCall = call;
      this.setupCallListeners(call);
    } catch (error: any) {
      console.error('Failed to make call:', error);
      this.notifyListeners(false, false);
      Alert.alert('Call Error', error.message || 'Failed to initiate call');
    }
  }

  endCall() {
    if (this.activeCall) {
      console.log('Ending call...');
      this.activeCall.disconnect();
      this.activeCall = null;
      this.notifyListeners(false, false);
    }
  }

  toggleMute(): boolean {
    if (this.activeCall) {
      const isMuted = this.activeCall.isMuted();
      this.activeCall.mute(!isMuted);
      return !isMuted;
    }
    return false;
  }

  isCallActive(): boolean {
    return this.activeCall !== null;
  }
}

export const twilioVoiceManager = TwilioVoiceManager.getInstance();