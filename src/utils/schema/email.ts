import * as Yup from 'yup';

export const EmailSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email address is required'),
});
