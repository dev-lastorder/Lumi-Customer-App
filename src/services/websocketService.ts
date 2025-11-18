// services/websocketService.ts
import { BASE_URL } from '@/environment';
import io, { Socket } from 'socket.io-client';

// Types matching your backend
interface IsentMessage {
  sender: string;
  receiver: string;
  text: string;
}

interface IReceivedMessage {
  sender: string;
  receiver: string;
  text: string;
}

// WebSocket configuration
const IS_DEV = __DEV__;
const WEBSOCKET_URL = IS_DEV ? BASE_URL : BASE_URL;

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private currentUserId: string | null = null;
  private messageListeners: ((message: IReceivedMessage) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  // Initialize WebSocket connection
  connect(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket && this.isConnected && this.currentUserId === userId) {
          console.log('✅ WebSocket already connected for user:', userId);
          resolve(true);
          return;
        }

        // Disconnect existing connection if different user
        if (this.socket) {
          this.disconnect();
        }

        console.log('🔌 Connecting to WebSocket:', WEBSOCKET_URL);
        this.socket = io(WEBSOCKET_URL, {
          transports: ['websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000,
          timeout: 20000,
        });

        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected with ID:', this.socket?.id);
          this.isConnected = true;
          this.currentUserId = userId;

          // Add user to backend connected users
          this.socket?.emit('add-user', userId);
          console.log('📤 Emitted add-user for:', userId);

          // Notify connection listeners
          this.connectionListeners.forEach((listener) => listener(true));
          resolve(true);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('❌ WebSocket disconnected', reason);
          this.isConnected = false;
          this.connectionListeners.forEach((listener) => listener(false));
        });

        
        this.socket.on("ride-completed", (data) => {
          console.log("Your ride has been completed successfully", data);

        });


        this.socket.on('connect_error', (error: any) => {
          console.error('❌ WebSocket connection error:', error);
          this.isConnected = false;
          this.connectionListeners.forEach((listener) => listener(false));
          reject(error);
        });

        // Listen for incoming messages (matching backend event)
        this.socket.on('receive-message', (message: IReceivedMessage) => {
          console.log('📥 Received message:', message);
          this.messageListeners.forEach((listener) => listener(message));
        });

        // Connection timeout
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000); // 10 second timeout
      } catch (error) {
        console.error('❌ WebSocket connection error:', error);
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentUserId = null;
    this.connectionListeners.forEach((listener) => listener(false));
  }

  // Send message via WebSocket (matching backend interface)
  sendMessage(message: IsentMessage): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected, cannot send message');
      return;
    }

    console.log('📤 Sending message via WebSocket:', message);
    this.socket.emit('send-message', message);
  }

  // Add listener for incoming messages
  onMessage(callback: (message: IReceivedMessage) => void): () => void {
    this.messageListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  // Add listener for connection status changes
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }
  onReceivedBid(callback: (bidData: any) => void): () => void {
    if (!this.socket) {
      console.warn('⚠️ Socket not initialized, cannot listen for bids');
      return () => { };
    }

    const handler = (bidData: any) => {
      console.log('📩 Received bid data:', bidData);
      callback(bidData);
    };

    this.socket.on('received-bids', handler);

    // Return unsubscribe function (for cleanup)
    return () => {
      this.socket?.off('received-bids', handler);
    };
  }

  // Emit a bid accepted event
  emitBidAccepted(rideRequestId: string, riderUserId: string,startType:any): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ Cannot emit bid-accepted — socket not connected');
      return;
    }

    const payload = { rideRequestId, riderUserId ,startType };
    console.log('📤 Emitting bid-accepted:', payload);
    this.socket.emit('bid-accepted', payload);
  }



  emitRideRaiseFare(payload: {
    rideRequestData: any; // full rideReq object from API
    latitude: any;
    longitude: any;
    radiusKm?: number;
  }): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ Cannot emit ride-request-fare-raised — socket not connected');
      return;
    }

    const dataToSend = {
      rideRequestData: {
        ...payload.rideRequestData,
        previousFare: payload.rideRequestData.previousFare?.toFixed?.(2) ?? 0,
        newFare: payload.rideRequestData.newFare?.toFixed?.(2) ?? 0,
      },
      latitude: payload.latitude?.toString() ?? '0',
      longitude: payload.longitude?.toString() ?? '0',
      radiusKm: payload.radiusKm ?? 5, // default to 5 km
    };

    console.log('📤 Emitting ride-request-fare-raised:', dataToSend);

    this.socket.emit('ride-request-fare-raised', dataToSend, (response: any) => {
      console.log('📥 Server response for ride-request-fare-raised:', response);
    });
  }

  emitRideRequest(payload: any): void {

    if (!this.socket || !this.isConnected) {
      console.error('❌ Cannot emit bid-accepted — socket not connected');
      return;
    }
    // const payload = { rideData };
    console.log('📤 Emitting bid-request:', payload);
    this.socket?.emit("ride-request-created-by-customer", payload, (response: any) => {
      console.log('📤 Ride request response from server:', response);
    });


  }

  // Get connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  // Reconnect if disconnected
  reconnect(): void {
    if (this.currentUserId && !this.isConnected) {
      console.log('🔄 Attempting to reconnect WebSocket');
      this.connect(this.currentUserId);
    }
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

// Export types
export type { IsentMessage, IReceivedMessage };
