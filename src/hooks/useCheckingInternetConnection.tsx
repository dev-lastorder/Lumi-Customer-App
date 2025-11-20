import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export const useInternetStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = async () => {
    try {
      const status = await Network.getNetworkStateAsync();
      setIsConnected(
        status.isConnected === true && status.isInternetReachable !== false
      );
    } catch (error) {
      
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();

    const interval = setInterval(checkConnection, 5000); // Re-check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return isConnected;
};
