interface ICreateUserPayload {
  userTypeId?: string;
  userId?: string;
  token: string;
  tokenExpiration: string;
  name: string;
  phone: string;
  phoneIsVerified: boolean;
  email: string;
  emailIsVerified: boolean;
  picture: string;
  addresses: string;
  isNewUser: boolean;
  isActive: string;
}

export interface ICreateUserResponse {
  createUser: ICreateUserPayload;
}
export interface ILoginResponse {
  loginPasswordless: ICreateUserPayload;
}
