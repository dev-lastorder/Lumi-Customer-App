import React, { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useAppSelector } from '@/redux/hooks';

// For setup the NativeWind with the app redux
export function ThemeSync() {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    if (currentTheme !== colorScheme) {
      
      setColorScheme(currentTheme);
    }
  }, [currentTheme, colorScheme, setColorScheme]);

  return null;
}
