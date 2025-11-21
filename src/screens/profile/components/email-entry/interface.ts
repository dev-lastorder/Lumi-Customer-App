interface ICheckEmailExistPayload {
  userType: string;
  _id: string;
  email: string;
}

export interface ICheckEmailExistResponse {
  emailExist: ICheckEmailExistPayload;
}


export interface FormValues {
  email: string;
}