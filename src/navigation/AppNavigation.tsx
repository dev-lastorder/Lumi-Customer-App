import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppSelector } from '@/redux/hooks';
import { LoadingPlaceholder } from '@/components';
import { useInitialAppLoad } from '@/hooks/useInitialAppLoad';
import { NavigationRedirectController } from './components/NavigationRedirectController';
import { useEffect, useState } from 'react';
import SplashVideo from '@/components/splash-screen';
import OfferYourFare from '@/screens/Rider/component/OfferYourFare';
import SplashGif from '@/components/splash-screen/newIndex';

const AppNavigation = () => {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const [splashDone, setSplashDone] = useState(false);
  const { isInitializing } = useInitialAppLoad();

  if (!splashDone) {
    return <SplashGif onFinish={() => setSplashDone(true)} />;
  }

  if (isInitializing) {
    return <LoadingPlaceholder placeholder="Initializing App..." />;
  }

  return (
    <>
      <NavigationRedirectController />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="CustomTabsScreen">
        {/* <Stack.Screen name="index" /> */}
        <Stack.Screen name="CustomTabsScreen" />
        <Stack.Screen name="LoginScreen" />
        {/* <Stack.Screen name="(tabs)" /> */}
        <Stack.Screen name="zone-selection" />
        <Stack.Screen name="+not-found" />

      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
};

export default AppNavigation;
