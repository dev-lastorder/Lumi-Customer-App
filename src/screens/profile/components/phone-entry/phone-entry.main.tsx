import { Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import { useRouter } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import PhoneInput, { ICountry, isValidPhoneNumber, ITheme } from 'react-native-international-phone-number';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import { AnimatedIconButton, LoadingPlaceholder } from '@/components';

// Hooks
import { useOTP } from '@/hooks';

// Types
import { PhoneEntryFormValues } from './interface';

// Schema
import { PhoneSchema } from '@/utils/schema';
import { useTheme } from '@react-navigation/native';
import { IModalStyles } from 'react-native-international-phone-number/lib/interfaces/modalStyles';
import { IPhoneInputStyles } from 'react-native-international-phone-number/lib/interfaces/phoneInputStyles';
import { RootState, useAppSelector } from '@/redux';

const initialValues = {
  phone: '',
  country: null,
};

export default function PhoneEntryMainComponent() {
  // Loacal values
  const { colors, dark } = useTheme();
  const { currentTheme } = useAppSelector((state: RootState) => state.theme);

  // Ref
  const formikRef = useRef<FormikProps<PhoneEntryFormValues>>(null);

  // Hooks
  const router = useRouter();

  //API
  const { onSendOTPToPhone, isPhoneOTPSending } = useOTP('phone-entry');

  const onPhoneOTPCallbackHandler = async () => {
    const _phone = `${formikRef.current?.values.country?.callingCode}${formikRef.current?.values.phone.replace(/ /g, '')}`;
    await AsyncStorage.setItem('phone', _phone || '');

    router.push({
      pathname: '/(food-delivery)/(profile)/verify-otp',
      params: {
        data: JSON.stringify({ phone: _phone }),
      },
    });
  };

  const onHandleSubmit = () => {
    const formikValues = formikRef.current?.values;
    const phone = formikValues?.phone;

    if (!phone || !isValidPhoneNumber(phone, formikValues.country as ICountry)) alert('Please enter valid phone');

    formikRef.current?.handleSubmit();
  };

  // 1️⃣ build a minimal ITheme to pass down

  // 2️⃣ override the built-in styles in IPhoneInputStyles

  // 3️⃣ style the country-picker modal background

  return (
    <View className="flex-1 justify-between">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={PhoneSchema}
        onSubmit={(values) => onSendOTPToPhone(`${values.country?.callingCode}${values.phone.replace(/ /g, '')}`, onPhoneOTPCallbackHandler)}
        validateOnChange={false}
      >
        {({ values, setFieldValue }) => {
          return (
            <View>
              <PhoneInput
                value={values.phone}
                theme={currentTheme}
                onChangePhoneNumber={(phone) => setFieldValue('phone', phone)}
                selectedCountry={values.country}
                onChangeSelectedCountry={(country) => setFieldValue('country', country)}
              // phoneInputStyles={{
              //   container: {
              //     backgroundColor: dark ? colors.card : colors.background,
              //   },
              // }}
              // textContainerStyle={{
              //   backgroundColor: colors.card,
              // }}
              // textInputStyle={{
              //   color: colors.text,
              //   paddingVertical: 10,
              //   paddingHorizontal: 12,
              // }}
              // codeTextStyle={{
              //   color: colors.text,
              // }}
              // flagButtonStyle={{
              //   marginLeft: 8,
              //   borderRightWidth: 1,
              //   borderRightColor: colors.border,
              // }}
              />
            </View>
          );
        }}
      </Formik>
      {isPhoneOTPSending ? (
        <View>
          <LoadingPlaceholder />
        </View>
      ) : (
        <TouchableOpacity className="w-full h-[42px] rounded-lg justify-center items-center  bg-primary" onPress={onHandleSubmit}>
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
