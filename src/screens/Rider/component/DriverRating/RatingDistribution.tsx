import { CustomText } from '@/components';
import { View } from 'react-native';

export const RatingDistribution = ({ ratings }: { ratings: { star: number; count: number }[] }) => {
  const total = ratings.reduce((acc, r) => acc + r.count, 0);

  return (
    <View className="mt-4">
      {ratings.map((r) => {
        const percentage = total > 0 ? (r.count / total) * 100 : 0;

        return (
          <View key={r.star} className="flex-row items-center mb-2">
            {/* Star label */}
            <CustomText fontSize="sm" className="w-12" lightColor="#B8B8B8" darkColor="#B8B8B8">
              {r.star} star
            </CustomText>

            {/* Progress bar */}
            <View className="flex-1 h-4 bg-gray-200 rounded-full mx-2 overflow-hidden">
              <View style={{ width: `${percentage}%` }} className="h-4 bg-[#FBC02D] rounded-full" />
            </View>

            {/* Count */}
            <CustomText fontSize="sm" className="w-6 text-right" lightColor="#B8B8B8" darkColor="#B8B8B8">
              {r.count}
            </CustomText>
          </View>
        );
      })}
    </View>
  );
};
