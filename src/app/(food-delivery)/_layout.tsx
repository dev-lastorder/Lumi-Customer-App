import { BottomTabsNavigator } from '@/navigation';
import {  View } from 'react-native';

export default function TabLayout() {
  
  return (
    <View style={{ flex: 1 }}>
      <BottomTabsNavigator/>
   
    </View>
  );
}