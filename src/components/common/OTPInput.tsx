import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';

interface OTPInputProps {
  onChangeText: (text: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  numberOfDigits?: number;
}

export interface OTPInputHandle {
  clear: () => void;
  setValue: (value: string) => void;
}

const OTPInput = forwardRef<OTPInputHandle, OTPInputProps>(
  (
    {
      onChangeText,
      hasError = false,
      disabled = false,
      numberOfDigits = 4,
    },
    ref
  ) => {
    const otpRef = useRef<OtpInputRef>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        otpRef.current?.clear();
      },
      setValue: (value: string) => {
        otpRef.current?.setValue(value);
      },
    }));

    return (
      <OtpInput
        ref={otpRef}
        numberOfDigits={numberOfDigits}
        focusColor="#3853A4"
        onTextChange={onChangeText}
        disabled={disabled}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
          returnKeyType: 'done',
        }}
        theme={{
          containerStyle: {
            marginVertical: 20,
          },
          pinCodeContainerStyle: {
            borderWidth: 2,
            borderColor: hasError ? '#FF6B6B' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            width: 65,
            height: 65,
            marginHorizontal: 6,
          },
          focusedPinCodeContainerStyle: {
            borderColor: hasError ? '#FF6B6B' : '#3853A4',
            borderWidth: 2.5,
          },
          filledPinCodeContainerStyle: {
            backgroundColor: '#FFFFFF',
            borderColor: '#3853A4',
          },
          pinCodeTextStyle: {
            fontSize: 28,
            fontWeight: '600',
            color: '#3853A4',
          },
          focusStickStyle: {
            backgroundColor: '#3853A4',
            height: 32,
            width: 2,
          },
        }}
      />
    );
  }
);

OTPInput.displayName = 'OTPInput';

export default OTPInput;