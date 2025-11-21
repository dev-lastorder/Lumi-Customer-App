import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// API
import { CHECK_EMAIL_EXIST, CHECK_PHONE_EXIST, SEND_OTP_TO_EMAIL, SEND_OTP_TO_PHONE } from '@/api';

import { ICheckEmailExistResponse, ICheckPhoneExistResponse } from '@/screens';

export const useOTP = (screenName: string) => {
  // Hooks
  const router = useRouter();

  // Email
  const [checkEmailExist, { loading: isCheckingEmail }] = useMutation(CHECK_EMAIL_EXIST);
  const [sendOTPToEmail, { loading: isEmailOTPSending }] = useMutation(SEND_OTP_TO_EMAIL);

  // Phone
  const [checkPhoneExist, { loading: isCheckingPhone }] = useMutation(CHECK_PHONE_EXIST);
  const [sendOTPToPhone, { loading: isPhoneOTPSending }] = useMutation(SEND_OTP_TO_PHONE);

  /*
      # EMAIL
  */
  const onSendOTPToEmail = async (email: string, callback?: Function) => {
    
    checkEmailExist({
      variables: {
        email,
      },
      onCompleted: (data) => onEmailOTPCompleted(data, email, callback),
      onError: onEmailOTPError,
    });
  };
  const onResendOTPToEmail = async () => {
    const email = (await AsyncStorage.getItem('email')) || '';
    await onSendOTPToEmail(email);
  };

  function onEmailOTPCompleted({ emailExist }: ICheckEmailExistResponse, email: string, callback?: Function) {
    
    if (!emailExist?._id) {
      // If user does not exist, send OTP
      onSendOTPToEmailHandler(email, callback);
    } else if (emailExist.userType === 'apple' || emailExist.userType === 'google' || emailExist.userType === 'facebook') {
      // If user exists but is a social account, navigate to Main
      // navigation.navigate({ name: 'Main', merge: true });
      alert(`Please login with ${emailExist?.userType}`)
    } else {
      onSendOTPToEmailHandler(email, callback ? () => callback('login') : () => {});
    }
  }
  function onEmailOTPError(error: any) {}

  const onSendOTPToEmailHandler = (email: string, callback?: Function) => {
    sendOTPToEmail({
      variables: {
        email: email || '',
      },
      onCompleted: (data) => {
        if (callback) callback();
      },
      onError: (error) => {
        const message = error.graphQLErrors?.[0].message;
        alert(message);

        switch (screenName) {
          case 'email-entry':
            if (callback) callback();
            break;
        }
      },
    });
  };

  /*
      # PHONE
  */
  const onSendOTPToPhone = async (phone: string, callback?: Function) => {
    checkPhoneExist({
      variables: {
        phone,
      },
      onCompleted: async (data) => await onPhoneOTPCompleted(data, phone, callback),
      onError: onPhoneOTPError,
    });
  };

  const onResentOTPToPhone = async () => {
    const phone = (await AsyncStorage.getItem('phone')) || '';
    await onSendOTPToPhone(phone);
  };

  async function onPhoneOTPCompleted({ phoneExist }: ICheckPhoneExistResponse, phone: string, callback?: Function) {
    if (!phoneExist?._id) {
      // If phone not already taken, send OTP
      await onSendOTPToPhoneHandler(phone, callback);
    } else {
      alert('Phone already taken');
    }
  }
  function onPhoneOTPError() {
    try {
    } catch (e) {}
  }

  const onSendOTPToPhoneHandler = async (phone: string, callback?: Function) => {
    sendOTPToPhone({
      variables: {
        phone,
      },
      onCompleted: () => {
        if (callback) callback();
      },
      onError: (error) => {
        alert(error?.graphQLErrors?.[0].message);

        switch (screenName) {
          case 'phone-entry':
            if (callback) callback();
            break;
        }
      }
    });
  };

  return {
    // Email
    onSendOTPToEmail,
    onResendOTPToEmail,
    isEmailOTPSending: isCheckingEmail || isEmailOTPSending,
    // Phone
    onSendOTPToPhone,
    onResentOTPToPhone,
    isPhoneOTPSending: isCheckingPhone || isPhoneOTPSending,
  };
};
