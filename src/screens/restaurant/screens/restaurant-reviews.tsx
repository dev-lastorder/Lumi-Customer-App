// ─── Imports ────────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { RestaurantReviewsBreakdown, RestaurantReviewsList, RestaurnatReviewsTabs } from '../components/restaurant-reviews';
import { CustomHeader } from '@/components';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_REVIEWS } from '@/api';
import { Restaurant } from '@/utils';



// ─── Main Screen Component ──────────────────────────────────────────────────
const RestaurantRatingReviewScreen = () => {
  const { info } = useLocalSearchParams();
  const { _id } = !!info ? (JSON.parse(info as string) as unknown as Restaurant) : {};

  const [activeTab, setActiveTab] = useState<'newest' | 'highest' | 'lowest'>('lowest');

  // API
  const { data, loading } = useQuery(GET_RESTAURANT_REVIEWS, {
    variables: {
      restaurant: _id,
    },
    skip: !_id,
  });

  const reviews = data?.reviewsByRestaurant?.reviews ?? [];
  const average = data?.reviewsByRestaurant?.ratings ?? 0


  const sortedReviews = useMemo(() => {
    if (!reviews) return [];

    return reviews
      .map((review: any) => ({
        _id: review._id,
        rating: review.rating,
        createdAt: review.createdAt,
        user: {
          _id: review?.order?.user?._id,
          name: review?.order?.user?.name,
        },
      }))
      .sort((a: any, b: any) => {
        switch (activeTab) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'highest':
            return b.rating - a.rating;
          case 'lowest':
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
  }, [activeTab, reviews]);

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* header */}
      <CustomHeader title={'Ratings & Reviews'} showGoBack={true} onGoBack={() => router.back()} rightIcons={[]} />

      {/* content */}
      <ScrollView className="p-4">
        <View>
          {/* review top section */}
          {!loading && <RestaurantReviewsBreakdown reviews={reviews} average={average}/>}
          {/* reviews tabs section */}
          <RestaurnatReviewsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* reviews cards list */}
          <RestaurantReviewsList reviews={sortedReviews ?? []} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantRatingReviewScreen;
