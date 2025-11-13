import { ICountry } from 'react-native-international-phone-number';
import * as Yup from 'yup';

export const PhoneSchema = Yup.object().shape({
  phone: Yup.string().required('Required'),
  country: Yup.mixed<ICountry>().required('Required'),
});
