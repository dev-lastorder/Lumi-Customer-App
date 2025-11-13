import * as Yup from 'yup';
import { IQueryType } from '../interfaces/select-help-type';
export const SelectHelpTypeSchema = Yup.object().shape({
  queryType: Yup.object().shape({ id: Yup.string().required(), label: Yup.string().required(), value: Yup.string().required() }),
  message: Yup.string().required(),
  orderId: Yup.string().when('queryType', {
    is: (queryType: IQueryType) => queryType.value === 'order',
    then: (schema) => schema.required('Order ID is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
