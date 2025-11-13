import { ToastPosition, TypeOptions } from 'react-toastify';

export interface IToastMessageFunctionProps {
  message: string;
  type: TypeOptions;
  position?: ToastPosition; 
}
