import messaging from '@react-native-firebase/messaging';


const requestNotificationPermission = async () => {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        return enabled;
    } catch (error) {
        console.log("❌ Notification permission error:", error);
        return false;
    }
}


const getDeviceToken = async () => {
    try {
       
        const hasPermission = await messaging().hasPermission();

        if (!hasPermission) {
            const permissionGranted = await requestNotificationPermission();
            if (!permissionGranted) {
                console.log("⚠️ Notification permission NOT granted");
                return null;
            }
        }

        
        let fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log("📲 FCM Token:", fcmToken);
            return fcmToken;
        }

        
        fcmToken = await messaging().getToken();
        return fcmToken ?? null;
    } catch (error) {
        console.log("❌ Error fetching FCM token:", error);
        return null;
    }
}


const firebaseMessagingService = {
    getDeviceToken
}

export default firebaseMessagingService
