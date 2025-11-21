import { LOGIN } from '@/api';
import { CustomIconButton } from '@/components';
import { useThemeColor } from '@/hooks';
import { loginSuccess, useAppSelector } from '@/redux';
import { IGoogleUser } from '@/utils/interfaces';
import { getUserInfoFromGoogle } from '@/utils/methods';
import { useMutation, useQuery } from '@apollo/client';
import { useTheme } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { GET_ZONES } from '@/api/graphql/query';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import ChooseZoneModal from '@/components/modals/choose-zone.modal';
import { Zone } from '@/components/modals/interfaces';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function LoginMainComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const router = useRouter();
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const iOSClientID = useAppSelector((state) => state.configuration.configuration.iOSClientID);
  const androidClientID = '650001300965-9ochl634tuvv6iguei6dl57jkmfto6r9.apps.googleusercontent.com';
  const enableAppleLogin = useAppSelector((state) => state.configuration.configuration.enableAppleLogin);

  const [loginUser] = useMutation(LOGIN, { onCompleted, onError });

  const { background, primary, border } = useThemeColor();

  const { data: zonesData, loading: zonesLoading } = useQuery(GET_ZONES);
  const { updateCurrentLocation, updateAddress, updateZone, location } = useLocationPicker();

  async function oLoginUserHandler(user: IGoogleUser) {
    setIsLoading(true);
    let notificationToken = null;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus === 'granted') {
        notificationToken = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
          })
        ).data;
      }
    }
    await loginUser({
      variables: {
        ...user,
        notificationToken: notificationToken,
      },
    });
  }

  async function onCompleted(data: { login: any }) {
    const loginData = data?.login;

    if (!loginData) return;

    setIsLoading(true);

    try {
      if (!loginData.isActive) {
        alert('Your account has been deactivated.');
        return;
      }

      const payload = {
        token: data.login.token,
        user: {
          id: data.login.userId,
          name: data.login.name,
          email: data.login.userId.email,
        },
      };

      await dispatch(loginSuccess(payload));
      alert('Successfully logged in');
    } catch (error) {
    } finally {
      setIsLoading(false);
      router.replace('/(food-delivery)/(discovery)/discovery');
    }
  }

  function onError(error: any) {
    try {
      alert(error?.graphQLErrors?.[0].message);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      // console.log(JSON.stringify(userInfo,null, 2))
      const google_user = userInfo?.data?.user;
      const userData = {
        name: google_user.name,
        email: google_user.email,
        phone: '',
        password: '',
        picture: google_user.photo,
        type: 'google' as 'google',
      };
      await oLoginUserHandler(userData);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google Play Services not available or outdated.');
      } else {
        console.log(error.message)
        alert('Google Sign-In error: ' + error.message);
      }
    }
  };

  // const onSignInWithGoogleCompleted = async () => {
  //   try {
  //     if (response?.type === 'success') {
  //       const google_user = await getUserInfoFromGoogle(response?.authentication?.accessToken || '');
  //       const userData = {
  //         name: google_user.name,
  //         email: google_user.email,
  //         phone: '',
  //         password: '',
  //         picture: google_user.picture,
  //         type: 'google' as 'google',
  //       };

  //       await oLoginUserHandler(userData);
  //     }
  //   } catch (error) { }
  // };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      const name = credential.fullName?.givenName ? credential.fullName?.givenName + ' ' + credential.fullName?.familyName : '';
      const user = {
        name: name,
        email: credential.email as string,
        phone: '',
        password: '',
        picture: '',
        appleId: credential.user,
        type: 'apple' as 'apple',
      };
      await oLoginUserHandler(user);
    } catch (error) { }
  };

  const onSignInEmailPasswordHandler = () => {
    router.push('/(food-delivery)/(profile)/email-entry');
  };

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: iOSClientID,
      webClientId: androidClientID, // Use webClientId for Android
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, [iOSClientID, androidClientID]);

  // useEffect(() => {
  //   onSignInWithGoogleCompleted();
  // }, [response]);

  return (
    <View className="w-full flex items-center gap-y-2 mb-3">
      <CustomIconButton
        icon={{ name: 'google' }}
        textStyle={{ color: currentTheme !== 'dark' ? 'black' : 'white' }}
        label="Continue with Google"
        onPress={signInWithGoogle}
        backgroundColor={background}
        borderColor={border}
        className="border"
      />
      {enableAppleLogin && (
        <CustomIconButton
          textStyle={{ color: currentTheme !== 'dark' ? 'black' : 'white' }}
          icon={{ name: 'apple-o' }}
          label="Continue with Apple"
          onPress={signInWithApple}
          backgroundColor={background}
          borderColor={border}
          className="border"
        />
      )}
      <CustomIconButton
        icon={{ name: 'mail', color: primary }}
        label="Continue with email"
        onPress={onSignInEmailPasswordHandler}
        backgroundColor={currentTheme === 'dark' ? 'transparent' : `${primary}33`}
        textStyle={{ color: primary }}
        borderColor={primary}
        className="border"
      />
      <CustomIconButton
        label="Explore nearby"
        onPress={() => setZoneModalVisible(true)}
        backgroundColor="transparent"
        textStyle={{ color: primary }}
      />

      <ChooseZoneModal
        visible={zoneModalVisible}
        zones={zonesData?.zonesCentral || []}
        selectedZoneId={location.zoneId ?? null}
        loading={zonesLoading}
        onClose={() => {
          setZoneModalVisible(false);
          if (location.zoneId) {
            router.navigate('/home');
          }
        }}
        onSelect={(zone: Zone) => {
          updateZone({
            addressId: '',
            label: '',
            latitude: zone.location.coordinates[1],
            longitude: zone.location.coordinates[0],
            zoneId: zone._id,
            zoneTitle: zone.title,
            selectedTitle: zone.title,
            zoneCoordinates: [],
          });
          setZoneModalVisible(false);
          router.navigate('/home');
        }}
      />
    </View>
  );
}