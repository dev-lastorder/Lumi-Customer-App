import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, IConfiguration, IConfigurationPayload, IConfigurationState, LoginPayload } from "../types";

const initialState: IConfigurationState = {
  configuration: {
    _id: "",
    currency: "",
    currencySymbol: "",
    deliveryRate: 0,
    twilioEnabled: false,
    androidClientID: "",
    iOSClientID: "",
    appAmplitudeApiKey: "",
    googleApiKey: "",
    expoClientID: "",
    customerAppSentryUrl: "",
    termsAndConditions: "",
    privacyPolicy: "",
    testOtp: "",
    skipMobileVerification: false,
    skipEmailVerification: false,
    costType: "",
    enableAppleLogin: false
  },
  status: "idle",
  error: null,
};

const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    // # Example reducers - feel free to modify
    setConfiguration: (state, action: PayloadAction<IConfigurationPayload>) => {
      state.configuration = action.payload.configuration as IConfiguration;
      state.status = "succeeded";
      state.error = null;
    },
  
    // # Add other reducers like loginRequest, loginFailure as needed
  },
});

export const { setConfiguration } = configurationSlice.actions;

export default configurationSlice.reducer;
