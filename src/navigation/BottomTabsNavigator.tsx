import { useAppSelector } from '@/redux/hooks';
import { Colors, PROTECTED_ROUTE, ROUTE, ZoneTypes } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Href, Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { TAB_CONFIG } from './constants';

function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={Platform.OS === 'ios' ? 24 : 28} name={name} color={color} />;
}

export default function BottomTabsNavigator() {
  // Hook
  const router = useRouter()

  // Redux
  const token = useAppSelector((state) => state.auth.token);
  const theme = useAppSelector((state) => state.theme?.currentTheme);
 
  const themeColors = Colors[theme];
  

  const handleProtectedRoute = (name: string) => ({
    tabPress: (e: any) => {
      e.preventDefault();
      if (token) {
        router.push(PROTECTED_ROUTE[name] as Href);
      } else {
        router.push(ROUTE.LOGIN as Href);
      }
    },
  });

  return (
    <Tabs
      initialRouteName="(discovery)"
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint ?? themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map(({ name, title, icon }) => {
        const isProtected = Boolean(PROTECTED_ROUTE[name]);

        return (
          <Tabs.Screen
            key={name}
            name={name}
            listeners={isProtected ? handleProtectedRoute(name) : undefined}
            options={{title, tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? icon : (`${icon}-outline` as any)} color={color} />}}
          />
        )})}
    </Tabs>
  );
}
