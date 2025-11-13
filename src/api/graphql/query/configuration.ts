import { gql } from '@apollo/client';

export const GET_CONFIGURATION = gql`
  query Configuration {
    configuration {
      _id
      currency
      currencySymbol
      deliveryRate
      twilioEnabled
      androidClientID
      iOSClientID
      appAmplitudeApiKey
      googleApiKey
      expoClientID
      customerAppSentryUrl
      termsAndConditions
      privacyPolicy
      testOtp
      skipMobileVerification
      skipEmailVerification
      costType
    }
  }
`;
