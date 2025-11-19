import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedIconButton } from '../Buttons';
import { CustomIcon } from '../Icon';
import { CustomText } from '../CustomText';
import { HeaderIconProps, BeforeLocationProps, AfterLocationProps, ChatAiProps } from './interface';
import adjust from '@/utils/helpers/adjust';
import { selectSuperAppUser, useAppSelector } from '@/redux';
import { useTypingText } from '@/hooks/useTypingText';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';


export const HeaderIcon = React.memo(
  ({ onPress, iconName, iconType = 'Feather', badge }: HeaderIconProps) => (
    <AnimatedIconButton
      onPress={onPress}
      style={{ width: adjust(36), height: adjust(36) }}
      className="relative  bg-white  border-[#E4E4E7] dark:bg-dark-icon-background rounded-full items-center justify-center"
    >
      <CustomIcon icon={{ size: 20, type: iconType, name: iconName as any }} />

      {badge && (
        <View className="absolute -top-2 -right-2 bg-primary rounded-full min-w-5 h-5 items-center justify-center px-1">
          <CustomText fontSize="xs" lightColor="#000" darkColor="#000">
            {badge}
          </CustomText>
        </View>
      )}
    </AnimatedIconButton>
  )
);

export const BeforeLocation = React.memo(
  ({ location, onPress }: BeforeLocationProps) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row justify-center items-center rounded-full self-start gap-2"
    >
      <HeaderIcon onPress={onPress} iconName="location-pin" iconType="SimpleLineIcons" />
      <CustomText variant='body' numberOfLines={1} fontWeight='normal'>
        {location}
      </CustomText>
      <CustomIcon icon={{ size: 20, type: 'Entypo', name: "chevron-down" }} />
    </TouchableOpacity>
  )
);

export const ChatAi = React.memo(({ location, onPress }) => {
  const user = useAppSelector((state) => state.auth.user);
  const newuser = useSelector(selectSuperAppUser);
  console.log(newuser)

  const name = user?.name ?? "User";
  const fullMessage = `Hello ${name || newuser?.name} 👋\nHow can I help you today?`;

  const animatedText = useTypingText(fullMessage, 40);

  // Find positions of "Hello" and name inside animatedText
  const helloIndex = animatedText.indexOf("Hello");
  const nameIndex = animatedText.indexOf(name);

  return (
    <TouchableOpacity className="flex-row items-start px-4 py-2 gap-3" onPress={()=>router.navigate("/(ai-chat)")}>
      <Image
        source={require("@/assets/images/chatAi.png")}
        className="w-32 h-32 resize-contain"
      />

      <View className="bg-white rounded-2xl px-4 py-3 shadow-md max-w-[60%]">
        <Text className="text-black text-md">
          {animatedText.split(" ").map((word, idx) => {
            if (word === "Hello") {
              return (
                <Text key={idx} className="font-bold text-black">
                  {word + " "}
                </Text>
              );
            }
            if (word === name) {
              return (
                <Text key={idx} className="font-bold text-black">
                  {word + " "}
                </Text>
              );
            }
            return word + " ";
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
});



export const AfterLocation = React.memo(
  ({ location, onPress, title }: AfterLocationProps) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex justify-center items-start rounded-full self-start gap-1"
    >
      <CustomText variant='subheading' numberOfLines={1} fontWeight='semibold'>
        {title}
      </CustomText>
      <View className='flex-row gap-2'>
        <CustomText variant='label' numberOfLines={1} fontWeight='medium'>
          {location}
        </CustomText>
        <CustomIcon icon={{ size: 20, type: 'Entypo', name: "chevron-down" }} />
      </View>
    </TouchableOpacity>
  )
);
