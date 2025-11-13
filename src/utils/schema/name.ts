import * as Yup from 'yup';

export const NamesSchema = Yup.object().shape({
  first_name: Yup.string().min(1, 'Min 1 char allowed').max(35, 'Max 35 chars allowed').required('Required'),
  last_name: Yup.string().max(35, 'Max 35 chars allowed').required('Required'),
  country: Yup.string().required('Required'),
});

export const NameOnlySchema = Yup.object().shape({
  name: Yup.string().min(1, 'Min 1 char allowed').max(35, 'Max 35 chars allowed').required('Full name is required'),
});
