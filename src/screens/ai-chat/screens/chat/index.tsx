import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { CustomIcon, CustomText } from '@/components';
import { ChatScreenHeader } from '../../components';
import { useThemeColor } from '@/hooks';
import CustomIconButtom from '@/components/common/Buttons/CustomIconButton';
import adjust from '@/utils/helpers/adjust';
import { TextInput } from 'react-native-gesture-handler';
import SearchAnimation from '@/screens/Rider/utils/SearchAnimation';

const index = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const homeNavigation = () => {
    router.push('/home');
  };
  const theme = useThemeColor();
  return (
    <GradientBackground>
      <View className="flex-1">
        <ChatScreenHeader leftButtonHandler={homeNavigation} rightButtonHandler={homeNavigation} title='Speaking to LUMI' />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          <View className="flex-1 items-center justify-center">
            <View className="w-[280] h-[256] my-4">
              <Image className="w-full h-full" resizeMode="contain" source={require('@/assets/images/ai-chat-screen-icon.png')} />
            </View>
            <Text className="text-[#1A1A1A] text-2xl font-bold">Whcih approach suits you?</Text>

            <View className="flex-row items-center gap-4 my-6">
              <TouchableOpacity className="rounded-[18] border-2 border-[#E4E4E7] h-[48] w-[138]">
                <View className="flex-1 flex-row items-center justify-center gap-2">
                  <CustomIcon icon={{ name: 'magic', type: 'FontAwesome', color: '#7487BF', size: adjust(16) }} />
                  <Text className="text-[16px] text-[#7487BF] leading-[22px]">AI Assisted</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-[18] border-2 border-[#E4E4E7] h-[48] w-[138]">
                <View className="flex-1 flex-row items-center justify-center gap-2">
                  <CustomIcon icon={{ name: 'hand-pointer-o', type: 'FontAwesome', color: '#7487BF', size: adjust(16) }} />

                  <Text className="text-[16px] text-[#7487BF] leading-[22px]">AI Assisted</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row items-center justify-center gap-4 my-6">
          <View className="flex-row items-center h-[48px] w-[270px] border border-gray-300 rounded-xl px-3">
            <TextInput placeholder="Ask me anything..." placeholderTextColor="#999" className="flex-1 text-base text-black" />
            <TouchableOpacity>
              <AntDesign name="audio" size={20} color='#3853A4' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="rounded-full bg-[#3853A4] h-[48] w-[48]">
            <View className="flex-1 flex-row items-center justify-center gap-2">
              <CustomIcon icon={{ name: 'send', type: 'Feather', color: '#FFFFFF', size: adjust(20) }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

export default index;
