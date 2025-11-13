export interface IUser {
  id?: string;
  userId?: string;
  token?: string;
  tokenExpiration?: number;
  name?: string;
  email?: string;
  phone?: string | null;
  country?: string | null;
  favourite?: string[] | null
}

// # Basic shared types (non-store specific)
export interface AuthState {
  isAuthenticated: boolean;
  user: IUser
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

export interface LoginPayload {
  user: IUser;
  token: string;
}


export interface ThemeState {
  currentTheme: 'light' | 'dark';
}

/* Configuration */
export interface IConfiguration {
  _id: string;
  currency: string;
  currencySymbol: string;
  deliveryRate: number;
  twilioEnabled: boolean;
  androidClientID: string;
  iOSClientID: string;
  appAmplitudeApiKey: string;
  googleApiKey: string;
  expoClientID: string;
  customerAppSentryUrl: string;
  termsAndConditions: string;
  privacyPolicy: string;
  testOtp: string;
  skipMobileVerification: boolean;
  skipEmailVerification: boolean;
  costType: string;
  enableAppleLogin?: boolean;
}

export interface IConfigurationState {
  configuration: IConfiguration;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

export interface IConfigurationPayload {
  configuration: IConfiguration;
}
