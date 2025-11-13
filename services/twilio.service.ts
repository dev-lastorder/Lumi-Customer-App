// src/services/twilio.service.ts - FIXED SINGLETON VERSION

import { Call, CallInvite, Voice } from "@twilio/voice-react-native-sdk";
import { PermissionsAndroid, Platform } from "react-native";
import apiService from "./api.service";

type CallStatus =
  | "idle"
  | "connecting"
  | "ringing"
  | "connected"
  | "disconnected";

  type AppType = 'customer' | 'driver';

class TwilioService {
  private static instance: TwilioService;
  private voice: Voice;
  private activeCall: Call | null = null;
  private activeCallInvite: CallInvite | null = null;
  private accessToken: string | null = null;
  private currentIdentity: string | null = null;
  public isRegistered: boolean = false;

  // Event callbacks - components will set these
  public onCallConnected: ((call: Call) => void) | null = null;
  public onCallDisconnected: ((call: Call | null, error?: any) => void) | null =
    null;
  public onCallRinging: ((call: Call) => void) | null = null;
  public onIncomingCall: ((callInvite: CallInvite) => void) | null = null;
  public onCallFailed: ((call: Call | null, error: any) => void) | null = null;

  private constructor() {
    console.log("🎧 Creating NEW Twilio Voice instance");
    this.voice = new Voice();
    this.setupEventListeners();
  }

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    } else {
      console.log("♻️ Reusing existing Twilio Voice instance");
    }
    return TwilioService.instance;
  }

  /**
   * Setup all Twilio Voice event listeners
   */
  //   private setupEventListeners(): void {
  //     console.log('🎧 Setting up Twilio event listeners...');

  //     // Incoming call arrives
  //     this.voice.on(Voice.Event.CallInvite, (callInvite: CallInvite) => {
  //       console.log('📞 Incoming call from:', callInvite.getFrom());
  //       this.activeCallInvite = callInvite;

  //       // Setup cancelled listener on the CallInvite
  //       callInvite.on(CallInvite.Event.Cancelled, (cancelledCallInvite: any) => {
  //         console.log('🚫 Incoming call cancelled');
  //         this.activeCallInvite = null;
  //       });

  //       if (this.onIncomingCall) {
  //         this.onIncomingCall(callInvite);
  //       }
  //     });

  //     // SDK registered successfully
  //     this.voice.on(Voice.Event.Registered, () => {
  //       console.log('✅ Registered with Twilio');
  //       this.isRegistered = true;
  //     });

  //     // SDK unregistered
  //     this.voice.on(Voice.Event.Unregistered, (error?: any) => {
  //       console.log('⚠️ Unregistered from Twilio');
  //       if (error) {
  //         console.error('Unregister error:', error);
  //       }
  //       this.isRegistered = false;
  //     });

  //     // Voice SDK errors
  //     this.voice.on(Voice.Event.Error, (error: any) => {
  //       console.error('❌ Twilio Voice SDK error:', error);

  //       // Handle call failures through error event
  //       if (this.onCallFailed && this.activeCall) {
  //         this.onCallFailed(this.activeCall, error);
  //         this.activeCall = null;
  //       }
  //     });
  //   }

  private setupEventListeners(): void {
    console.log("🎧 Setting up Twilio event listeners...");

    // ========== DEBUG: Log ALL possible events ==========
    const allPossibleEvents = [
      "callInvite",
      "cancelledCallInvite",
      "registered",
      "unregistered",
      "error",
      "audioDevicesUpdated",
    ];

    console.log("🔍 Registering listeners for events:", allPossibleEvents);

    allPossibleEvents.forEach((eventName) => {
      this.voice.on(eventName as any, (...args: any[]) => {
        console.log(
          `🔔🔔🔔 VOICE EVENT FIRED: ${eventName}`,
          JSON.stringify(args, null, 2)
        );
      });
    });
    // ========== END DEBUG ==========

    // Incoming call arrives
    this.voice.on(Voice.Event.CallInvite, (callInvite: CallInvite) => {
      console.log("📞📞📞 INCOMING CALL EVENT! From:", callInvite.getFrom());
      console.log("📞 CallInvite object:", {
        from: callInvite.getFrom(),
        to: callInvite.getTo(),
        callSid: callInvite.getCallSid(),
      });

      this.activeCallInvite = callInvite;

      // Setup cancelled listener
      callInvite.on(CallInvite.Event.Cancelled, (cancelledCallInvite: any) => {
        console.log("🚫 Incoming call cancelled");
        this.activeCallInvite = null;
      });

      if (this.onIncomingCall) {
        console.log("📞 Calling onIncomingCall callback");
        this.onIncomingCall(callInvite);
      } else {
        console.log("⚠️ onIncomingCall callback is NULL!");
      }
    });

    // SDK registered successfully
    this.voice.on(Voice.Event.Registered, () => {
      console.log("✅ Registered with Twilio");
      this.isRegistered = true;
    });

    // SDK unregistered
    this.voice.on(Voice.Event.Unregistered, (error?: any) => {
      console.log("⚠️ Unregistered from Twilio");
      if (error) {
        console.error("Unregister error:", error);
      }
      this.isRegistered = false;
    });

    // Voice SDK errors
    this.voice.on(Voice.Event.Error, (error: any) => {
      console.error("❌ Twilio Voice SDK error:", error);

      // Handle call failures
      if (this.onCallFailed && this.activeCall) {
        this.onCallFailed(this.activeCall, error);
        this.activeCall = null;
      }
    });

    console.log("✅ All event listeners registered");
  }

  /**
   * Setup call-specific event listeners
   * These are set on each individual call object
   */
  private setupCallListeners(call: Call): void {
    // Call is ringing
    call.on(Call.Event.Ringing, (callInstance: Call) => {
      console.log("📲 Call is ringing...");
      this.activeCall = callInstance;
      if (this.onCallRinging) {
        this.onCallRinging(callInstance);
      }
    });

    // Call connected
    call.on(Call.Event.Connected, (callInstance: Call) => {
      console.log("✅ Call connected!");
      this.activeCall = callInstance;
      if (this.onCallConnected) {
        this.onCallConnected(callInstance);
      }
    });

    // Call disconnected
    call.on(Call.Event.Disconnected, (callInstance: Call, error?: any) => {
      console.log("❌ Call disconnected");
      if (error) {
        console.error("Call disconnection error:", error);
      }
      this.activeCall = null;
      if (this.onCallDisconnected) {
        this.onCallDisconnected(callInstance, error);
      }
    });

    // Call reconnecting
    call.on(Call.Event.Reconnecting, (callInstance: Call, error: any) => {
      console.log("🔄 Call reconnecting...");
      if (error) {
        console.error("Reconnection error:", error);
      }
    });

    // Call reconnected
    call.on(Call.Event.Reconnected, (callInstance: Call) => {
      console.log("✅ Call reconnected!");
    });
  }

  /**
   * Request microphone permission (Android)
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message:
              "This app needs access to your microphone to make voice calls",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        const permissionGranted =
          granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log(
          "🎤 Microphone permission:",
          permissionGranted ? "Granted" : "Denied"
        );
        return permissionGranted;
      } catch (err) {
        console.error("Permission error:", err);
        return false;
      }
    }
    return true;
  }

  /**
   * Initialize and register with Twilio
   * @param identity - User's unique identity (e.g., "customer_123")
   */
  async initialize(identity: string, appType: AppType): Promise<boolean> {
    try {
      console.log("🚀 Initializing Twilio for identity:", identity);

      // If already registered with same identity, skip
      if (this.isRegistered && this.currentIdentity === identity) {
        console.log("⏭️ Already registered with same identity, skipping");
        return true;
      }

      // If registered with different identity, unregister first
      if (this.isRegistered && this.currentIdentity !== identity) {
        console.log("🔄 Changing identity, unregistering first");
        await this.cleanup();
      }

      // Request permissions first
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Microphone permission denied");
      }

      // Get access token from backend
      this.accessToken = await apiService.getTwilioToken(identity, appType);
      this.currentIdentity = identity;

      // Register with Twilio
      await this.voice.register(this.accessToken);

      console.log("✅ Twilio initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Twilio:", error);
      throw error;
    }
  }

  /**
   * Make an outgoing call
   * @param recipientIdentity - Identity of person to call (e.g., "driver_456")
   */
  async makeCall(recipientIdentity: string): Promise<Call> {
    try {
      if (!this.isRegistered) {
        throw new Error("Not registered with Twilio. Call initialize() first.");
      }

      if (!this.accessToken) {
        throw new Error("No access token available");
      }

      console.log("📞 Making call to:", recipientIdentity);

      // Connect params - these get passed as custom parameters
      const connectParams = {
        params: {
          To: recipientIdentity,
          From: this.currentIdentity || "unknown",
        },
      };

      // Make the call
      const call = await this.voice.connect(this.accessToken, connectParams);
      this.activeCall = call;

      // Setup call event listeners
      this.setupCallListeners(call);

      console.log("📲 Call initiated");
      return call;
    } catch (error) {
      console.error("❌ Failed to make call:", error);
      throw error;
    }
  }

  /**
   * Accept an incoming call
   */
  async acceptCall(): Promise<Call> {
    try {
      if (!this.activeCallInvite) {
        throw new Error("No incoming call to accept");
      }

      console.log("✅ Accepting incoming call...");
      const call = await this.activeCallInvite.accept();
      this.activeCall = call;
      this.activeCallInvite = null;

      // Setup call event listeners
      this.setupCallListeners(call);

      return call;
    } catch (error) {
      console.error("❌ Failed to accept call:", error);
      throw error;
    }
  }

  /**
   * Reject an incoming call
   */
  async rejectCall(): Promise<void> {
    try {
      if (!this.activeCallInvite) {
        throw new Error("No incoming call to reject");
      }

      console.log("🚫 Rejecting incoming call...");
      await this.activeCallInvite.reject();
      this.activeCallInvite = null;
    } catch (error) {
      console.error("❌ Failed to reject call:", error);
      throw error;
    }
  }

  /**
   * Disconnect active call
   */
  async disconnect(): Promise<void> {
    try {
      if (this.activeCall) {
        console.log("📴 Disconnecting call...");
        await this.activeCall.disconnect();
        this.activeCall = null;
      }
    } catch (error) {
      console.error("❌ Failed to disconnect call:", error);
      throw error;
    }
  }

  /**
   * Mute/unmute the call
   */
  async toggleMute(): Promise<boolean> {
    try {
      if (!this.activeCall) {
        throw new Error("No active call");
      }

      const isMuted = await this.activeCall.isMuted();
      await this.activeCall.mute(!isMuted);
      console.log(isMuted ? "🔊 Unmuted" : "🔇 Muted");

      return !isMuted;
    } catch (error) {
      console.error("❌ Failed to toggle mute:", error);
      throw error;
    }
  }

  /**
   * Check if there's an active call
   */
  hasActiveCall(): boolean {
    return this.activeCall !== null;
  }

  /**
   * Get current call state
   */
  getCallState(): CallStatus {
    if (!this.activeCall) return "idle";
    return "active" as CallStatus;
  }

  /**
   * Cleanup and unregister
   */
  async cleanup(): Promise<void> {
    try {
      console.log("🧹 Cleaning up Twilio service...");

      if (this.activeCall) {
        await this.disconnect();
      }

      if (this.isRegistered && this.accessToken) {
        await this.voice.unregister(this.accessToken);
      }

      this.activeCall = null;
      this.activeCallInvite = null;
      this.isRegistered = false;
    } catch (error) {
      console.error("❌ Error during cleanup:", error);
    }
  }
}

// Export singleton instance
export default TwilioService.getInstance();
