import { CREATE_SUPPORT_TICKET } from '@/api';
import { CustomDropdown, CustomIconButton, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { selectHelpTypeDropDown } from '@/utils';
import { ISelectHelpTypeFormData } from '@/utils/interfaces';
import { SelectHelpTypeSchema } from '@/utils/schema';
import { ApolloError, useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import { Formik, FormikState } from 'formik';
import { Alert, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';

export default function SelectHelpTypeMain() {
  const router = useRouter();
  const appTheme = useThemeColor();

  const initialValues: ISelectHelpTypeFormData = {
    queryType: null,
    message: '',
    orderId: '',
  };

  const [createSupportTicket, { loading: creatingTicket }] = useMutation(CREATE_SUPPORT_TICKET);

  const handleFormSubmit = async (
    values: ISelectHelpTypeFormData,
    resetForm: (nextState?: Partial<FormikState<ISelectHelpTypeFormData>> | undefined) => void
  ) => {
    try {

      await createSupportTicket({
        variables: {
          ticketInput: {
            title: values.queryType.label,
            description: values.message,
            otherDetails: values.message,
            category: values.queryType.value === 'order' ? 'order' : 'other',
            orderId: values.orderId,
            userType: 'User',
          },
        },
      });
      Alert.alert('Success', 'Your support ticket has been created successfully.', [
        { text: 'Ok', style: 'destructive', onPress: () => router.push("/(food-delivery)/(profile)/tickets") },
      ]);
    } catch (err) {
      const error = err as ApolloError;
      Alert.alert('Failed Attempt', error.cause?.message);
    } finally {
      resetForm();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, justifyContent: 'space-between' }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={SelectHelpTypeSchema}
        onSubmit={(values, { resetForm }) => handleFormSubmit(values, resetForm)}
      >
        {({ values, errors, setFieldValue, handleSubmit }) => (
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View className='gap-y-4 top-4'>
              <View>
                <CustomText variant="label">Please select your query type</CustomText>
                <CustomDropdown
                  items={selectHelpTypeDropDown}
                  value={values.queryType?.value}
                  placeholder="Select a query type"
                  onChange={(val) => {
                    const selected = selectHelpTypeDropDown.find((item) => item.value === val);
                    setFieldValue('queryType', selected);
                  }}
                />
              </View>
              {values.queryType?.value === 'order' && (
                <View>
                  <CustomText variant="label">Order Id</CustomText>
                  <TextInput
                    value={values.orderId}
                    className={`w-full px-4 py-4 border rounded-md text-base text-black dark:text-white my-2 ${errors.orderId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    onChangeText={(val) => setFieldValue('orderId', val)}
                  />
                </View>
              )}
              <View>
                <CustomText variant="label">Message</CustomText>
                <TextInput
                  value={values.message}
                  multiline
                  className={`w-full px-4 py-4 border rounded-md text-base my-2 text-black dark:text-white ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                    }`}
                  onChangeText={(val) => setFieldValue('message', val)}
                />
              </View>
            </View>
            <View>
              <CustomIconButton
                label={creatingTicket ? 'Please wait...' : 'Continue'}
                onPress={() => {
                  if (!values.queryType) {
                    return Alert.alert('Warning', 'Please select your query type', [{ text: 'Ok', style: 'destructive' }]);
                  }
                  handleSubmit();
                }}
                width={'100%'}
                className={`w-full rounded-xl mx-auto my-8`}
                backgroundColor={appTheme.primary}
              />
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}
