// ====================================
// Imports
// ====================================
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { CustomText, LoadingPlaceholder } from '@/components';

// ====================================
// Types
// ====================================
interface Props {
  isLoadingMore: boolean;
  hasMore: boolean;
  isShow: boolean;
}

// ====================================
// Component: CouponListFooter
// ====================================
const CouponListFooter: React.FC<Props> = ({ isShow, isLoadingMore, hasMore }) => {
  if (isLoadingMore) {
    return (
      <View className="py-6 items-center">
        <LoadingPlaceholder />
        <CustomText variant="caption" className="mt-2 text-gray-400">
          Loading more coupons...
        </CustomText>
      </View>
    );
  }

  if (!hasMore && isShow) {
    return (
      <View className="py-6 items-center">
        <CustomText variant="caption" className="text-gray-400">
          🎉 You’ve reached the end
        </CustomText>
      </View>
    );
  }

  return null;
};

export default CouponListFooter;
