// ====================================
// Imports
// ====================================
import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';

// ====================================
// Types
// ====================================
interface Props {
  coupon: {
    _id: string;
    title: string;
    discount: number;
    enabled: boolean;
    isActive: boolean;
    restaurantId: string | null;
    restaurantType: string | null;
    endDate: string | null;
    lifeTimeActive: boolean;
    startDate: string | null;
    createdAt: string;
  };
}

// ====================================
// Component: CouponCard
// ====================================
const CouponCard: React.FC<Props> = ({ coupon }) => {
  // format date as M/D/YY
  const ts = parseInt(coupon.createdAt, 10);
  const formattedDate = isNaN(ts)
    ? ''
    : new Date(ts).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });

  return (
    <View className="mb-4 px-4 py-3 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 flex-row items-center justify-between shadow-sm">
      {/* Left: details */}
      <View className="flex-1 pr-2">
        {/* Title */}
        <CustomText variant="heading3" fontWeight="semibold" className="text-black dark:text-white mb-1">
          {coupon.title}
        </CustomText>

        {/* Date + Discount */}
        <View className="flex-row items-center">
          {/* Date */}
          <CustomText variant="label" className="text-gray-500 dark:text-gray-400">
            {formattedDate}
          </CustomText>

          {/* Spacer */}
          <View className="w-2" />

          {/* Discount pill */}
          <View className="px-2 py-0.5 bg-[#5AC12F66] rounded-full">
            <CustomText variant="caption" fontWeight="medium" lightColor="black" darkColor="white">
              {coupon.discount}% off
            </CustomText>
          </View>
        </View>
      </View>

      {/* Right: status pill */}
      <View className={`px-3 py-1 rounded-full ${coupon.isActive ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'}`}>
        <CustomText
          variant="label"
          fontWeight="medium"
          fontSize="sm"
          lightColor={coupon?.isActive ? '#065F46' : '#991B1B'}
          darkColor={coupon?.isActive ? '#065F46' : '#991B1B'}
          className={`text-xs ${coupon.isActive ? 'text-[#065F46]' : 'text-[#991B1B]'}`}
        >
          {coupon.isActive ? 'Active' : 'Expired'}
        </CustomText>
      </View>
    </View>
  );
};

export default CouponCard;
