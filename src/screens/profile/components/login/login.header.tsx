// Core
import { CustomText } from '@/components';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks';
import { useTheme } from '@react-navigation/native';
import { useAppSelector } from '@/redux';
// import { useThemeColor } from '@/hooks';

export default function LoginHeaderComponent() {
  // Grab the current theme (light vs dark) from React Navigation
  const { dark } = useTheme();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  // Define gradient end color based on theme
  const endColor = currentTheme === 'dark'
    ? 'rgba(0, 0, 0, 0.9)' // almost-black in dark mode
    : 'rgba(255, 255, 255, 0.9)'; // almost-white in light mode

  return (
    <View className="w-full flex-1 relative ">
      <View className="flex justify-center items-center">
        <Image className="h-[100%] w-full" source={require('@/assets/GIFs/login.gif')} />
      </View>

      <View className="absolute bg-gradient-to-b from-transparent to-black   -bottom-5 z-[999999] w-full   items-center  ">
        <LinearGradient colors={['transparent', endColor]} style={styles.gradient} start={[0, 0]} end={[0, 0.7]} />



        <Image source={require("../../../../assets/images/LogoLastOrder.png")} className='w-28 h-28 mb-5' resizeMode='cover' />


        <CustomText fontSize="3xl" fontWeight="bold" fontFamily="Poppins" className="pt-3">
          Welcome to Last Order
        </CustomText>
        <CustomText style={{ textAlign: 'center', marginHorizontal: 40 }} variant="body" fontSize='sm' fontWeight="normal">
          Enjoy the best products or get what you need from nearby stores, delivered
        </CustomText>
        {/* </LinearGradient> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350,
  },
});
