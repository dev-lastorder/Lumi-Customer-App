import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useDispatch } from 'react-redux';

// Components
import { LoadingPlaceholder } from '@/components';

// API
import { CREATE_USER, LOGIN_PASSWORDLESS, VERIFY_OTP } from '@/api';

// Interface
import { ICreateUserResponse, ILoginResponse } from './interface';

// Redux
import { IUser, loginSuccess, setUser, useAppSelector } from '@/redux';

// Hooks
import { useOTP, useThemeColor } from '@/hooks';
import { useTheme } from '@react-navigation/native';

export default function VerifyOTPMainComponent() {
  // local states
  const { colors, dark } = useTheme();
  const appTheme = useThemeColor()
  const digitColor = dark ? '#0000' : '#ffff'; // this will switch between light/dark
  const activeBorder = '#AAC810';

  

  // Params
  const { op, data } = useLocalSearchParams();
  const { email, phone, back } = data ? JSON.parse(data as string) : { email: '', phone: '', back: '' };

  // Redux
  const auth = useAppSelector((state) => state.auth);

  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const { onResendOTPToEmail, onResentOTPToPhone } = useOTP('verify-otp');

  //API
  const [loginPasswordless, { loading: isLoggingIn }] = useMutation(LOGIN_PASSWORDLESS);
  const [verifyOTP, { loading }] = useMutation(VERIFY_OTP);
  const [createUser, { loading: isCreatingUser }] = useMutation(CREATE_USER);

  // Handlers
  const onLoginPasswordLessHandler = async (otp: string) => {
    const notificationToken = '';

    await loginPasswordless({
      variables: {
        email,
        otp,
        notificationToken,
      },
      onCompleted: async ({ loginPasswordless }: ILoginResponse) => {
        const _user = {
          id: loginPasswordless.userId,
          userId: loginPasswordless.userId,
          token: loginPasswordless.token,
          tokenExpiration: Number(loginPasswordless.tokenExpiration),
          name: loginPasswordless.name,
          email: loginPasswordless.email,
          phone: loginPasswordless.phone,
        };

        const payload = {
          user: _user,
          token: loginPasswordless.token,
        };

        dispatch(loginSuccess(payload));
        router.replace('/(food-delivery)/(discovery)/discovery');
      },
      onError: (error) => {
        alert(error.graphQLErrors?.[0].message || 'Login failed');
      },
    });
  };
  const onVerifyOTPHandler = async (otp: string) => {
    await verifyOTP({
      variables: {
        otp,
        data: {
          ...(email && { email }),
          ...(phone && { phone }),
        },
      },
      onCompleted: async () => {
        dispatch(setUser(!!email ? { email: email || '' } : { phone: phone || '' }));
        if (phone) {
          const isUpdatingUser = await AsyncStorage.getItem('isUpdatingUser');
          if (isUpdatingUser && Boolean(isUpdatingUser) === true) {
            AsyncStorage.removeItem('isUpdatingUser');
            router.replace('/(food-delivery)/(profile)/account');
          } else {
            await onHandlerUserCreation({ phone });
          }
          return;
        }

        if (back !== 'go-back') {
          
          router.push({
            pathname: '/(food-delivery)/(profile)/add-profile-details-setup',
            params: { data: JSON.stringify({ email }) },
          });
        } else {
          
          router.replace('/(food-delivery)/(profile)/account');
        }
      },
      onError: (error) => {
        const message = error.graphQLErrors[0].message;
        alert(message);
      },
    });
  };

  const onHandlerUserCreation = async (data: IUser) => {
    await createUser({
      variables: {
        userInput: {
          phone: auth?.user?.phone ?? '',
          email: auth?.user?.email,
          password: '',
          name: auth?.user?.name,
          notificationToken: 'SOME_TOKEN',
          ...data,
        },
      },
      onCompleted: async ({ createUser }: ICreateUserResponse) => {
        const _user = {
          id: createUser.userId,
          userId: createUser.userId,
          token: createUser.token,
          tokenExpiration: Number(createUser.tokenExpiration),
          name: createUser.name,
          email: createUser.email,
          phone: createUser.phone,
        };

        const payload = {
          user: _user,
          token: createUser.token,
        };

        dispatch(loginSuccess(payload));
        router.replace('/(food-delivery)/(discovery)/discovery');
        // router.push('/(food-delivery)/index');
      },
    });
  };

  return (
    <View className="flex-1 justify-between">
      <View>
        <OtpInput
          theme={{
            containerStyle: { justifyContent: 'center' },
            pinCodeContainerStyle: {
              borderWidth: 1,
              borderColor: '#CCC',
              width: 48,
              height: 56,
              borderRadius: 8,
              marginHorizontal: 6,
            },
            focusedPinCodeContainerStyle: {
              borderColor: activeBorder,
            },
            pinCodeTextStyle: {
              color: appTheme.text,
              fontSize: 20,
              fontWeight: '600',
            },
          }}
          textInputProps={{
            selectionColor: activeBorder,
            style: { color: appTheme.text },
          }}
          type="numeric"
          numberOfDigits={6}
          onFilled={op === 'login' ? onLoginPasswordLessHandler : onVerifyOTPHandler}
        />

        <TouchableOpacity className="w-full h-[42px] rounded-lg mt-5 justify-center items-center  bg-primary " onPress={!!email ? onResendOTPToEmail : onResentOTPToPhone}>
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>
      {(loading || isLoggingIn || isCreatingUser) && (
        <View>
          <LoadingPlaceholder />
        </View>
      )}
    </View>
  );
}
