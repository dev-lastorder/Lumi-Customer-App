// Hooks
import { logout, toggleTheme, useAppSelector } from '@/redux';

// React Native
import { View } from 'react-native';

// React Native Switch
import { Switch } from 'react-native-switch';

// Components
import { CustomPaddedView, CustomText } from '@/components';
import CustomIconButtom from '@/components/common/Buttons/CustomIconButton';
import { useThemeColor, useTranslation } from '@/hooks';
import { LANGUAGES } from '@/utils';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import AccountStack from './account-stack';
import { router } from 'expo-router';
import ScreenSubHeader from '@/components/common/ScreenSubHeader';

export default function AccountMain() {
  // States
  const [isNotificationTurnedOn, setIsNotificationTurnedOn] = useState(false);
  const [isEmailNotificationTurnedOn, setIsEmailNotificationTurnedOn] = useState(false);

  // Hooks
  const { currentLang } = useTranslation();
  const appTheme = useThemeColor();
  const dispatch = useDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const email = useAppSelector((state) => state.auth.user.email);
  const phone = useAppSelector((state) => state.auth.user.phone);
  const name = useAppSelector((state) => state.auth.user.name);
  return (
    <CustomPaddedView className="flex-1 justify-start items-center gap-4" style={{ backgroundColor: appTheme.background, paddingTop: 0 }}>
      <View className="w-full mb-4 mt-0">
        <View className='ms-2'>
          <ScreenSubHeader title='Personal Info' />
        </View>
        <AccountStack isExternal={false} content={email} route={'/(food-delivery)/(profile)/edit-profile-content'} title={'Email Address'} />
        <AccountStack isExternal={false} content={phone ?? ''} route={'/edit-profile-content'} title={'Mobile Number'} />
        <AccountStack isExternal={false} content={name} route={'/edit-profile-content'} title={'Name'} />
        <AccountStack isExternal={false} content={''} route={'/edit-profile-content'} title={'Delete Account'} />
      </View>

      <View className="w-full my-4">
        <View className='ms-2'>
          <ScreenSubHeader title='Marketing Notificaiton' />
        </View>

        <View className='px-4 '>
          <View className="w-full mt-4 flex flex-row justify-between border-b border-gray-100 dark:border-dark-border/30 py-2">
            <CustomText variant="label" fontWeight="medium" fontSize="md" style={{ color: appTheme.text }}>
              Push Notifications
            </CustomText>
            <View>
              <Switch
                circleBorderWidth={2}
                containerStyle={{ width: '20%' }}
                switchWidthMultiplier={2}
                activeText={''}
                inActiveText={''}
                circleActiveColor={appTheme.primary}
                backgroundActive={appTheme.primary}
                circleBorderActiveColor="#E9EBE9"
                circleBorderInactiveColor="#E9EBE9"
                activeTextStyle={{ color: appTheme.black }}
                value={isNotificationTurnedOn}
                backgroundInactive={appTheme.bgLight}
                onValueChange={() => setIsNotificationTurnedOn((prev) => !prev)}
              />
            </View>
          </View>
        </View>

        {/* <View className='px-4 '>
          <View className="w-full mt-4 flex flex-row justify-between  border-b border-gray-100 dark:border-dark-border/30 py-2">
            <CustomText variant="label" fontWeight="medium" fontSize="md" style={{ color: appTheme.text }}>
              Email Notifications
            </CustomText>
            <View>
              <Switch
                containerStyle={{ width: '20%' }}
                switchWidthMultiplier={2}
                activeText={''}
                inActiveText={''}
                circleActiveColor={appTheme.primary}
                circleBorderWidth={2}
                backgroundActive={appTheme.primary}
                circleBorderActiveColor="#E9EBE9"
                circleBorderInactiveColor="#E9EBE9"
                activeTextStyle={{ color: appTheme.black }}
                backgroundInactive={appTheme.bgLight}
                value={isEmailNotificationTurnedOn}
                onValueChange={() => setIsEmailNotificationTurnedOn((prev) => !prev)}
              />
            </View>
          </View>
        </View> */}
      </View>

      <View className="w-full my-4">
        <View className='ms-2'>
          <ScreenSubHeader title='Data Protection' />
        </View>

        <AccountStack isExternal={true} content={''} route={'https://enatega-web.netlify.app/privacy'} title={'Privacy Statement'} />
        <AccountStack isExternal={true} content={''} route={'https://enatega-web.netlify.app/terms'} title={'Terms Of Service'} />
      </View>

      <View className="w-full my-4">
        <View className='ms-2'>
          <ScreenSubHeader title='App Settings' />
        </View>

        <AccountStack
          isExternal={false}
          content={LANGUAGES.find((lng) => lng.code === currentLang)?.value ?? ''}
          route={'/edit-profile-content'}
          title={'Choose Language'}
        />
      </View>
      <View className="w-full flex flex-row justify-between  py-4 px-3">

        <ScreenSubHeader title='Theme' />


        <View>
          <Switch
            circleBorderWidth={2}
            containerStyle={{ width: '20%' }}
            switchWidthMultiplier={2}
            activeText={''}
            inActiveText={''}
            circleActiveColor={appTheme.primary}
            circleBorderActiveColor="#E9EBE9"
            circleBorderInactiveColor="#E9EBE9"
            backgroundActive={appTheme.primary}
            activeTextStyle={{ color: appTheme.black }}
            value={currentTheme === 'dark'}
            backgroundInactive="#E9EBE9"
            onValueChange={() => dispatch(toggleTheme())}
          />
        </View>
      </View>
      <View className="w-full my-4 items-center justify-center">
        <CustomIconButtom
          label="Sign out"
          width={'92%'}
          onPress={() => {
            dispatch(logout());
            router.replace('/(food-delivery)/(profile)/login');
          }}
          backgroundColor="#ffd1d1"
          textColor="#fc2b28"
          textStyle={{ fontWeight: 'semibold' }}
          className="my-4"
        />
      </View>
    </CustomPaddedView>
  );
}
