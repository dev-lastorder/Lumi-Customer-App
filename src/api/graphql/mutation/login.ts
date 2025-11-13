import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String, $password: String, $type: String!, $appleId: String, $name: String, $notificationToken: String) {
    login(email: $email, password: $password, type: $type, appleId: $appleId, name: $name, notificationToken: $notificationToken) {
      userId
      token
      tokenExpiration
      isActive
      name
      email
      phone
      isNewUser
    }
  }
`;

export const LOGIN_PASSWORDLESS = gql`
  mutation Login($email: String!, $otp: String!, $notificationToken: String) {
    loginPasswordless(email: $email, otp: $otp, notificationToken: $notificationToken) {
      userId
      token
      tokenExpiration
      isActive
      name
      email
      phone
      isNewUser
    }
  }
`;

export const CHECK_EMAIL_EXIST = gql`
  mutation EmailExist($email: String!) {
    emailExist(email: $email) {
      userType
      _id
      email
    }
  }
`;

export const CHECK_PHONE_EXIST = gql`
  mutation PhoneExist($phone: String!) {
    phoneExist(phone: $phone) {
      userType
      _id
      phone
    }
  }
`;

export const SEND_OTP_TO_EMAIL = gql`
  mutation SendOtpToEmail($email: String!) {
    sendOtpToEmail(email: $email) {
      result
    }
  }
`;
export const SEND_OTP_TO_PHONE = gql`
  mutation SendOtpToPhoneNumber($phone: String!) {
    sendOtpToPhoneNumber(phone: $phone) {
      result
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOTP($otp: String!, $data: OTPData!) {
    verifyOTP(otp: $otp, data: $data)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($userInput: UserInput) {
    createUser(userInput: $userInput) {
      userId
      token
      tokenExpiration
      name
      email
      phone
    }
  }
`;

export const UPDATE_PUSH_TOKEN = gql`
  mutation PushToken($token: String) {
    pushToken(token: $token) {
      _id
      notificationToken
    }
  }
`;
