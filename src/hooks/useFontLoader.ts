import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';


export const useFontLoader = () => {
  const [loaded, error] = useFonts({
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Inter-Light': require('../assets/fonts/Inter_24pt-Light.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter_24pt-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter_24pt-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter_24pt-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter_24pt-Bold.ttf'),
    'Inter-Black': require('../assets/fonts/Inter_24pt-Black.ttf'),
    'Inter-Italic': require('../assets/fonts/Inter_24pt-Italic.ttf'),
    'Inter-BoldItalic': require('../assets/fonts/Inter_24pt-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  return loaded;
};