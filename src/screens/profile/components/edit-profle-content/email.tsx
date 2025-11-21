// GQL
import { UPDATE_PROFILE } from '@/api/graphql/query/profile';

// Components
import { CustomIconButton } from '@/components';

// Hooks
import { useOTP, useThemeColor } from '@/hooks';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Schema
import { EmailSchema } from '@/utils/schema';

// Formik
import { Formik, FormikState } from 'formik';

// React Native
import { Alert, Text, TextInput, View } from 'react-native';

// APIs
import { SEND_OTP_TO_EMAIL } from '@/api';
import MailSvg from '@/assets/svg/mail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Interfaces
import { IEditProfileEmailProps } from '@/utils/interfaces/edit-profile-email';

export default function ProfileEmailUpdate({ content }: IEditProfileEmailProps) {
  // States
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { onSendOTPToEmail, isEmailOTPSending } = useOTP('email-entry');

  // Hooks
  const router = useRouter();
  const appTheme = useThemeColor();

  // Apollo mutation hook
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE);
  const [sendOtpToEmail] = useMutation(SEND_OTP_TO_EMAIL);

  // Handlers
  const handleFormSubmit = async (
    values: { email: string },
    resetForm: (
      nextState?:
        | Partial<
          FormikState<{
            email: string;
          }>
        >
        | undefined
    ) => void
  ) => {
    try {
      const email = values.email.trim().toLowerCase();

      router.push({
        pathname: '/(food-delivery)/(profile)/verify-otp',
        params: {
          op: 'update',
          verificationType: 'email',
          data: JSON.stringify({ email: email || '', back: 'go-back' }),
        },
      });
      await AsyncStorage.setItem('isUpdatingUser', 'true');
      await sendOtpToEmail({
        variables: { email },
        onCompleted: (data) => {
          if (data?.sendOtpToEmail?.result) {
            updateProfile({
              variables: {
                updateUserInput: {
                  email: email,
                },
              },
            });
          }
        },
        onError: (error) => {
          
          Alert.alert('Email OTP', error?.cause?.message || 'Failed to send OTP. Please try again.');
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

  return (
    <View className="p-2 w-full max-w-md mx-auto">
      <Formik initialValues={{ email: content }} enableReinitialize={true} validationSchema={EmailSchema} onSubmit={(values, { resetForm }) => handleFormSubmit(values, resetForm)}>
        {({ setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => {
          return (
            <View className="justify-between flex-col w-full h-[95%]">
              <View>
                <TextInput
                  value={values.email}
                  onChangeText={(text) => setFieldValue('email', text)}
                  onBlur={handleBlur('email')}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={"gray"}
                  placeholderClassName=''
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    margin: "auto",
                    padding: 13,
                    borderColor: appTheme.border,
                    borderRadius: 8,
                    color: appTheme.text,
                    fontSize: 16
                  }}
                />
                {errors.email && touched.email && <Text className="mt-2 text-sm text-red-500 ms-6 ">{errors.email}</Text>}
              </View>

              <MailSvg className='block mx-auto' style={{ display: "flex", margin: "auto" }} />
              <CustomIconButton
                label={loading ? 'Please wait' : 'Update'}
                className={`w-full rounded-xl mx-auto my-8`}
                textColor='#ffff'
                backgroundColor={loading ? appTheme.textSecondary : appTheme.primary}
                onPress={() => handleSubmit()}
              />


              {error && (
                <View className="bg-red-100 p-3 rounded-md">
                  <Text className="text-red-700">Error: {error.message || 'Failed to update email address'}</Text>
                </View>
              )}

              {updateSuccess && (
                <View className="bg-green-100 p-3 rounded-md">
                  <Text className="text-green-700">Email address updated successfully!</Text>
                </View>
              )}
            </View>
          );
        }}
      </Formik>
    </View>
  );
}
