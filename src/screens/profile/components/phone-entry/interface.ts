import { ICountry } from "react-native-international-phone-number";

interface ICheckPhoneExistPayload {
  userType: string;
  _id: string;
  phone: string;
}

export interface ICheckPhoneExistResponse {
  phoneExist: ICheckPhoneExistPayload;
}


export interface PhoneEntryFormValues {
  phone: string;
  country: ICountry | null;
}