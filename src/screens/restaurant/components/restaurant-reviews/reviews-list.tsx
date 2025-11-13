// ──────────────────────────────────────────────
// 📦 Imports
// ──────────────────────────────────────────────
import React from 'react';
import { FlatList, View } from 'react-native';

// 🔧 Components
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';
import { getTimeAgo } from '@/utils/methods';

// 🧠 Types
interface Props {
  reviews: {
    _id: string;
    rating: number;
    user: {
      _id: string;
      name: string;
    };
    description: string;
    createdAt: number;
  }[];
}

// ──────────────────────────────────────────────
// 🧩 Component: ReviewList
// ──────────────────────────────────────────────
const ReviewList: React.FC<Props> = ({ reviews }) => {
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => {
        return (
          <View className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
            {/* ── User Name */}
            <CustomText variant="subheading" fontSize="lg" fontWeight="semibold" className="text-black dark:text-white">
              {item.user?.name}
            </CustomText>

            {/* ── Stars + Date */}
            <View className="flex-row items-center mt-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <View className="mr-1" key={i}>
                  <CustomIcon
                    icon={{
                      name: i < item.rating ? 'star' : 'star-o',
                      type: 'FontAwesome',
                      size: 18,
                      color: i < item.rating ? '#FFA500' : '#aaa',
                    }}
                  />
                </View>
              ))}
              <CustomText variant="caption" className="ml-2 text-gray-500 dark:text-gray-400">
                {getTimeAgo(new Date(Number(item.createdAt)))}
              </CustomText>
            </View>
          </View>
        );
      }}
    />
  );
};

export default ReviewList;
