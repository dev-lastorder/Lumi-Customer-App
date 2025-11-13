import { UPDATE_PROFILE } from '@/api/graphql/query/profile';

// Components
import { CustomIconButton } from '@/components';

// Hooks
import { useThemeColor } from '@/hooks';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Schema
import { NameOnlySchema } from '@/utils/schema';

// Formik
import { Formik, FormikState } from 'formik';

// React Native
import NameUpdateIcon from '@/assets/svg/NameUpdate';
import { Alert, Text, TextInput, View } from 'react-native';

// Interfaces
import { IEditProfileNameProps } from '@/utils/interfaces/edit-profile-name';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux';

export default function ProfileNameUpdate({ content }: IEditProfileNameProps) {
  // States
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [oldUserName, setOldUserName] = useState(content)

  // Hooks
  const appTheme = useThemeColor();

  // Apollo mutation hook
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE,);

  // Handlers
  const handleFormSubmit = async (
    values: { name: string },
    resetForm: (
      nextState?:
        | Partial<
          FormikState<{
            name: string;
          }>
        >
        | undefined
    ) => void
  ) => {
    try {
      const name = values.name.trim();

      // Directly update the profile with the new name
      await updateProfile({
        variables: {
          updateUserInput: {
            name: name,
          },
        },
        onCompleted: (data) => {
          if (data?.updateUser?.name) {
            setUpdateSuccess(true);
            dispatch(setUser({ name: data?.updateUser?.name }))
            setOldUserName(data?.updateUser?.name)
          }
          setTimeout(() => {
            setUpdateSuccess(false);
          }, 3000);
          resetForm();
        },
        onError: (error) => {
          
          Alert.alert('Update Error', error?.message || 'Failed to update name. Please try again.');
        },
      });
    } catch (err) {
      
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View className="p-4  max-w-md mx-auto w-full">
      <Formik
        initialValues={{ name: oldUserName }}
        validationSchema={NameOnlySchema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => handleFormSubmit(values, resetForm)}
      >
        {({ setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => {
          return (
            <View className="justify-between flex-col w-full h-[95%]">
              <View>
                <TextInput
                  value={values.name}
                  onChangeText={(text) => setFieldValue('name', text)}
                  onBlur={handleBlur('name')}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  style={{
                    borderWidth: 1,
                    width: '90%',
                    margin: 'auto',
                    padding: 13,
                    borderColor: appTheme.border,
                    borderRadius: 8,
                    color: appTheme.text,
                    fontSize: 16,
                  }}
                />
                {errors.name && touched.name && <Text className="mt-2 ms-5 text-sm text-red-500">{errors.name}</Text>}
              </View>
              <NameUpdateIcon className='block mx-auto' style={{ display: "flex", margin: "auto" }} />
              <CustomIconButton
                label={loading ? 'Please wait' : 'Update Name'}
                className={`w-full rounded-xl mx-auto my-4`}
                backgroundColor={loading ? appTheme.textSecondary : appTheme.primary}
                onPress={() => handleSubmit()}
              />

              {error && (
                <View className="bg-red-100 p-3 rounded-md">
                  <Text className="text-red-700">Error: {error.message || 'Failed to update name'}</Text>
                </View>
              )}

              {updateSuccess && (
                <View className="bg-green-100 p-3 rounded-md">
                  <Text className="text-green-700">Name updated successfully!</Text>
                </View>
              )}
            </View>
          );
        }}
      </Formik>
    </View>
  );
}
