import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export function useNotifications() {
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get permission for notifications!');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    return token;
  }

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { registerForPushNotificationsAsync };
}
