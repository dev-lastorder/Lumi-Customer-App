import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';

const ContactInformation = () => {
  return (
    <View className="mt-4">
      {/* ── Section Title */}
      <CustomText variant="subheading" fontWeight="semibold" fontSize="lg" className="mb-2 text-black dark:text-white ">
        Contact info
      </CustomText>

      {/* ── Info Paragraphs */}
      <CustomText fontSize="sm" className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        If you have allergies or dietary restrictions, please contact the restaurant for dish-specific information.
      </CustomText>

      <CustomText fontSize="sm" className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        The Partner is committed to only offering products and/or services that comply with the applicable laws.
      </CustomText>

      {/* ── Support Row */}
     {/*  <View className="d-flex flex-row pt-2 items-center justify-between">
        <CustomText fontWeight="medium" className="text-black dark:text-white text-base">
          Enatega Support
        </CustomText>
        <TouchableOpacity>
          <CustomText lightColor="#AAC810" darkColor="#AAC810" className="text-primary font-semibold text-base">
            Open chat
          </CustomText>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default ContactInformation;
