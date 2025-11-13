// ─────────────────────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { View } from 'react-native';

// 🧩 Components
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';

// 🧠 Types
interface Props {
    average: number;
  reviews: { rating: number }[];
}

// ─────────────────────────────────────────────────────────────
// 🧩 Component: RatingBreakdown
// ─────────────────────────────────────────────────────────────
const RatingBreakdown: React.FC<Props> = ({average, reviews }) => {
  const total = reviews?.length ?? 0;


  // Count how many times each star rating appears
  // Initialize counts with 0 for each star 1 to 5
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Count ratings in one pass
  reviews?.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    }
  });

  // Map to desired format
  const ratingCount = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star] || 0,
  }));

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <CustomText variant="heading3" fontWeight="semibold" className="flex-1 my-2">
          All Ratings ({total})
        </CustomText>

        <View className="flex-row  items-center justify-center gap-2">
          <CustomIcon
            icon={{
              name: 'star-o',
              type: 'FontAwesome',
              size: 28,
              color: '#FFA500',
            }}
          />
          <CustomText className="mt-2" variant="heading2" fontWeight="bold">
            {average}
          </CustomText>
        </View>
      </View>

      {/* Rating Bars */}
      {ratingCount?.map(({ star, count }) => {
        const percentage = count ?? ((count / total) * 100).toFixed(0);
       
        return (
          <View key={star} className="flex-row items-center mb-2">
            <CustomText variant="body" className="w-4 text-black dark:text-white">
              {star}
            </CustomText>
            <CustomIcon icon={{ name: 'star', type: 'FontAwesome', size: 14, color: '#FFA500' }} />
            <View className="flex-1 bg-gray-300 h-1.5 rounded-full mx-2 overflow-hidden">
              <View className={`bg-[#FFA500] h-1.5`} style={{ width: `${percentage}%` } as any} />
            </View>
            <CustomText variant="caption" className="w-8 text-black dark:text-white">
              {percentage}%
            </CustomText>
          </View>
        );
      })}
    </View>
  );
};

export default RatingBreakdown;
