import { BottomTabsNavigator } from '@/navigation';
import {  View } from 'react-native';
import { GlobalComponent } from '@/components/globle';

export default function TabLayout() {
  
  return (
    <View style={{ flex: 1 }}>
      <BottomTabsNavigator/>
      <GlobalComponent />
    </View>
  );
}