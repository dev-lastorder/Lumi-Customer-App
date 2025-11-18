import { showInfoToast } from "../toast";

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber.trim()) {
    showInfoToast('Phone Required', 'Please enter your phone number');
    return false;
  }

  if (phoneNumber.trim().length < 7) {
    showInfoToast('Invalid Phone', 'Please enter a valid phone number');
    return false;
  }

  return true;
};
