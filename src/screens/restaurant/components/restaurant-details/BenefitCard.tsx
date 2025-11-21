// src/components/cards/BenefitCard.tsx
import { AnimatedIconButton, CustomIcon, CustomText } from '@/components'; // Assuming these are in src/components/index.ts
import React from 'react';
import { View } from 'react-native';

interface BenefitCardProps {
  badgeText: string;
  benefitLine1: string;
  benefitLine2: string;
  detailsText?: string;
  onDetailsPress?: () => void;
  badgeBgClass?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  badgeText,
  benefitLine1,
  benefitLine2,
  detailsText = 'Show details',
  onDetailsPress,
  badgeBgClass = 'bg-primary dark:bg-dark-primary',
}) => {
  return (
    <View className="bg-card dark:bg-dark-card rounded-xl p-4 flex-row items-center shadow-sm dark:shadow-none dark:border dark:border-dark-border/30">
      <View className={`${badgeBgClass} rounded-full px-3 py-1 mr-3`}>
        <CustomText fontWeight="bold" fontSize="xs" className="text-white" isDefaultColor={false}>
          {badgeText}
        </CustomText>
      </View>

      <View className="flex-1">
        <CustomText fontSize="sm" fontWeight="semibold" className="text-text dark:text-dark-text" isDefaultColor={false}>
          {benefitLine1}
        </CustomText>
        <CustomText fontSize="sm" fontWeight="semibold" className="text-text dark:text-dark-text mt-0.5" isDefaultColor={false}>
          {benefitLine2}
        </CustomText>
      </View>

      {onDetailsPress && (
        <AnimatedIconButton onPress={onDetailsPress} className="flex-row items-center pl-2">
          <CustomText fontSize="xs" fontWeight="medium" className="text-primary dark:text-dark-primary mr-1" isDefaultColor={false}>
            {detailsText}
          </CustomText>
          <CustomIcon
            icon={{ type: 'Ionicons', name: 'arrow-forward', size: 16 }}
            isDefaultColor={false}
            className="text-primary dark:text-dark-primary"
          />
        </AnimatedIconButton>
      )}
    </View>
  );
};

export default BenefitCard;

// usecase

{
  /* <View className="px-4 mb-6">
  <BenefitCard
    badgeText="Wolt+"
    benefitLine1="Exclusive benefit: 10%"
    benefitLine2="off pickup"
    onDetailsPress={() => 
  />
</View>; */
}
