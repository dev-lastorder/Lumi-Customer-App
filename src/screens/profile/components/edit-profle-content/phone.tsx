// GQL
import { UPDATE_PROFILE } from '@/api/graphql/query/profile';

// Components
import { CustomIconButton } from '@/components';

// Hooks
import { useOTP, useThemeColor } from '@/hooks';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Schema
import { PhoneSchema } from '@/utils/schema';

// Formik
import { Formik, FormikState } from 'formik';

// React Native
import { Alert, Text, View } from 'react-native';

// React Native Phone Input
import { SEND_OTP_TO_PHONE } from '@/api';
import MobilePhoneIcon from '@/assets/svg/number-update';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
// import countries from 'react-native-international-phone-number/countries'; // Import country data

// Interfaces / types
import { IEditProfileMobileProps } from '@/utils/interfaces/edit-profile-mobile';
import { useTheme } from '@react-navigation/native';
import { RootState, useAppSelector } from '@/redux';


export default function ProfilePhoneUpdate({ content }: IEditProfileMobileProps) {
  // States
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { onSendOTPToPhone, isPhoneOTPSending } = useOTP('phone-entry');

  // Hooks
  const router = useRouter();
  const appTheme = useThemeColor();
  const theme = useTheme();

  const { currentTheme } = useAppSelector((state: RootState) => state.theme);



  // Apollo mutation hook
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE);
  const [sendOtpToPhone, { loading: isSendingOtp }] = useMutation(SEND_OTP_TO_PHONE);


  // Handlers
  const handleFormSubmit = async (
    values: { phone: string; country: ICountry },
    resetForm: (
      nextState?:
        | Partial<
          FormikState<{
            phone: string;
            country: ICountry;
          }>
        >
        | undefined
    ) => void
  ) => {
    try {
      const phone = `${values.country.callingCode}${values.phone.replace(/ /g, '')}`;

      router.push({
        pathname: '/(food-delivery)/(profile)/verify-otp',
        params: {
          op: 'update',
          verificationType: 'phone',
          data: JSON.stringify({ phone: phone || '', back: 'go-back' }),
        },
      });
      await AsyncStorage.setItem('isUpdatingUser', 'true');
      await sendOtpToPhone({
        variables: { phone },
        onCompleted: (data) => {
          if (data?.sendOtpToPhoneNumber?.result) {
            updateProfile({
              variables: {
                updateUserInput: {
                  phone: phone,
                },
              },
            });
          }
        },
        onError: (error) => {

          Alert.alert('Phone OTP', error?.cause?.message || 'Failed to send OTP. Please try again.');
        },
      });

      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

      resetForm();
    } catch (err) {

    }
  };


  // function parsePhoneNumber(fullPhone: string) {
  //   // Example: +923051244293
  //   if (!fullPhone) return { country: countries.find(c => c.iso2 === 'PK'), phone: '' };
  //   const match = countries.find(c => fullPhone.startsWith(c.callingCode));
  //   if (match) {
  //     return {
  //       country: match,
  //       phone: fullPhone.replace(match.callingCode, ''),
  //     };
  //   }
  //   // fallback
  //   return { country: countries.find(c => c.iso2 === 'PK'), phone: fullPhone };
  // }



  return (
    <View className="p-2 max-w-md mx-auto">
      <Formik
        initialValues={{ phone: content, country: 'PK' as unknown as ICountry }}
        enableReinitialize
        validationSchema={PhoneSchema}
        onSubmit={(values, { resetForm }) => handleFormSubmit(values, resetForm)}
      >
        {({ setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => {
          return (
            <View className="justify-between flex-col h-[95%] w-[95%]">
              <View >
                <PhoneInput
                  // textStyle={{ color: theme?.dark ? '#fff' : '#000' }}
                  // containerStyle={{ backgroundColor: theme?.dark ? '#000' : '#fff' }}
                  theme={currentTheme}
                  defaultValue={content}
                  defaultCountry="PK"
                  selectedCountry={values.country}
                  className="w-full py-4"
                  onChangeSelectedCountry={(country) => setFieldValue('country', country)}
                  onChangePhoneNumber={(phone) => setFieldValue('phone', phone)}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  placeholder="Enter phone number"
                />
                {errors.phone && touched.phone && <Text className="mt-1 text-sm text-red-500">{errors.phone}</Text>}
              </View>

              <MobilePhoneIcon className='block mx-auto' style={{ display: "flex", margin: "auto" }} />
              <CustomIconButton
                label={loading ? 'Please wait' : 'Update Phone Number'}
                className={`w-full rounded-xl mx-auto my-4`}
                backgroundColor={loading ? appTheme.textSecondary : appTheme.primary}
                onPress={() => handleSubmit()}
              />


              {error && (
                <View className="bg-red-100 p-3 rounded-md">
                  <Text className="text-red-700">Error: {error.message || 'Failed to update phone number'}</Text>
                </View>
              )}

              {updateSuccess && (
                <View className="bg-green-100 p-3 rounded-md">
                  <Text className="text-green-700">Phone number updated successfully!</Text>
                </View>
              )}
            </View>
          );
        }}
      </Formik>
    </View>
  );
}
