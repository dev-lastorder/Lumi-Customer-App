import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

// Components
import { AnimatedIconButton, InputWithLabel, LoadingPlaceholder } from '@/components';
import { NamesSchema } from '@/utils/schema';
import { Formik, FormikProps } from 'formik';
import { useRef } from 'react';
import { AddProfileDetailsSetupFormValues } from './interface';

// API

// Components
import { CustomDropdown } from '@/components';

// Redux
import { setUser } from '@/redux';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_COUNTRIES_DROPDOWN } from '@/api';

const initialValues = {
  first_name: '',
  last_name: '',
  country: '',
};

export default function AddProfileDetailsSetupMainComponent() {
  // Params
  const { data } = useLocalSearchParams();
  const { email } = data ? JSON.parse(data as string) : { email: '' };

  // Ref
  const formikRef = useRef<FormikProps<AddProfileDetailsSetupFormValues>>(null);

  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  // API
  const { data: dropdownData, loading } = useQuery(GET_COUNTRIES_DROPDOWN);

  // Handlers

  const onHandleSubmitProfileDetails = (values: AddProfileDetailsSetupFormValues) => {

    dispatch(setUser({ country: values.country, name: `${values.first_name} ${values.last_name}` }));

    router.push('/(food-delivery)/(profile)/phone-entry');
  };

  const onHandleSubmit = () => {

    formikRef.current?.handleSubmit();
  };

  return (
    <View className="flex-1 justify-between">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={NamesSchema}
        onSubmit={onHandleSubmitProfileDetails}
        validateOnChange={false}
      >
        {({ values, errors, setFieldValue }) => {
          return (
            <View>
              <CustomDropdown
                label="Country"
                placeholder="Select your country"
                items={dropdownData?.getCountriesDropdown || []}
                value={values.country}
                onChange={(val) => {
                  setFieldValue('country', val);
                  formikRef.current?.validateField('country');
                }}
              />
              <InputWithLabel
                label="Email"
                iconName="mail"
                type="default"
                iconPosition="right"
                disabled={true}
                keyboardType="email-address"
                value={email}
              />
              <InputWithLabel
                label="First Name"
                errorMessage={errors.first_name}
                showErrorMessage={true}
                value={values.first_name}
                onChangeText={(val) => {
                  setFieldValue('first_name', val);
                  formikRef.current?.validateField('first_name');
                }}
              />
              <InputWithLabel
                label="Last Name"
                errorMessage={errors.last_name}
                showErrorMessage={true}
                value={values.last_name}
                onChangeText={(val) => {
                  setFieldValue('last_name', val);
                  formikRef.current?.validateField('last_name');
                }}
              />
            </View>
          );
        }}
      </Formik>
      {false ? (
        <View>
          <LoadingPlaceholder />
        </View>
      ) : (
        <TouchableOpacity className="w-full h-[42px] rounded-lg justify-center items-center  bg-primary" onPress={onHandleSubmit}>
          <Text className="text-white ">Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
