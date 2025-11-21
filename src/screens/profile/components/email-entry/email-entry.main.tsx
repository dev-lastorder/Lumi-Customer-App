import { Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import { useRouter } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import { AnimatedIconButton, InputWithLabel, LoadingPlaceholder } from '@/components';

// Hooks
import { useOTP } from '@/hooks';

// Types
import { FormValues } from './interface';

// Schema
import { EmailSchema } from '@/utils/schema';

const initialValues = {
  email: '',
};

export default function EmailEntryMainComponent() {
  // Ref
  const formikRef = useRef<FormikProps<FormValues>>(null);

  // Hooks
  const router = useRouter();
  const { onSendOTPToEmail, isEmailOTPSending } = useOTP('email-entry');

  const onEmailOTPCallbackHandler = async (op: string = 'new') => {
    await AsyncStorage.setItem('email', formikRef.current?.values.email || '');
    router.push({
      pathname: '/(food-delivery)/(profile)/verify-otp',
      params: {
        op,
        verificationType: 'email',
        data: JSON.stringify({ email: formikRef.current?.values?.email || '' }),
      },
    });
  };

  const onHandleSubmit = () => {
    formikRef.current?.handleSubmit();
  };

  return (
    <View className="flex-1 justify-between">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={EmailSchema}
        onSubmit={(values) => onSendOTPToEmail(values.email, onEmailOTPCallbackHandler)}
        validateOnChange={false}
      >
        {({ values, errors, setFieldValue }) => {
          return (
            <View>
              <InputWithLabel
                label="Email"
                iconName="mail"
                type="default"
                iconPosition="right"
                keyboardType="email-address"
                value={values.email}
                errorMessage={errors?.email}
                onChangeText={(val) => {
                  setFieldValue('email', val);
                  formikRef.current?.validateField('email');
                }}
              />
            </View>
          );
        }}
      </Formik>
      {isEmailOTPSending ? (
        <View>
          <LoadingPlaceholder />
        </View>
      ) : (
        <TouchableOpacity className="w-full h-[42px] rounded-lg justify-center items-center  bg-primary " onPress={onHandleSubmit}>
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
