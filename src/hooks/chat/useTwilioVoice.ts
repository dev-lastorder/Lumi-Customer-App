import { useEffect, useState } from 'react';
import { twilioVoiceManager } from '@/services/api/twilioVoiceManager';

interface UseTwilioVoiceReturn {
  makeCall: (recipientPhone?: string) => Promise<void>;
  endCall: () => void;
  toggleMute: () => boolean;
  isCallActive: boolean;
  isConnecting: boolean;
}

export const useTwilioVoice = (userId: string | undefined): UseTwilioVoiceReturn => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!userId) return;
  
    // Initialize once
    twilioVoiceManager.initialize(userId);
  
    // Subscribe to call state changes
    const unsubscribe = twilioVoiceManager.subscribe((active, connecting) => {
      setIsCallActive(active);
      setIsConnecting(connecting);
    });
  
    return unsubscribe; // This now returns void as expected
  }, [userId]);

  const makeCall = async (recipientPhone?: string) => {
    if (userId) {
      await twilioVoiceManager.makeCall(userId, recipientPhone);
    }
  };

  const endCall = () => {
    twilioVoiceManager.endCall();
  };

  const toggleMute = () => {
    return twilioVoiceManager.toggleMute();
  };

  return {
    makeCall,
    endCall,
    toggleMute,
    isCallActive,
    isConnecting,
  };
};