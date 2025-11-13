import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, TextInput } from 'react-native';
import { Rating, RATINGS, ReviewStep } from '@/utils/enums/rating';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOrderForReview } from '@/hooks/useOrderForReview';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';

const OrderReview: React.FC = () => {
  const { id, restaurantName, orderDate } = useLocalSearchParams();
  const orderId = id as string;

  const [currentStep, setCurrentStep] = useState<ReviewStep>(ReviewStep.RATING_SELECTION);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState('');

  const router = useRouter();

  // ✅ Fetch real order data
  const { orderData, loading: orderLoading, error: orderError } = useOrderForReview(orderId);

  // ✅ Hook for submitting reviews
  const { submitReview, loading: submitting, success, error: submitError } = useReviewSubmission(orderId);

  // ✅ Navigate away when review is successfully submitted
  // useEffect(() => {
  //   if (success) {
  //     const timer = setTimeout(() => {
  //       router.push('/(food-delivery)/(discovery)/discovery');
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [success, router]);

  const handleRatingSelect = (rating: Rating): void => {
    setSelectedRating(rating);
    setCurrentStep(ReviewStep.FEEDBACK_DETAILS);
  };

  const handleBackToStep1 = (): void => {
    setCurrentStep(ReviewStep.RATING_SELECTION);
    setSelectedRating(null);
  };

  const handleSkipButton = (): void => {
    router.push('/(food-delivery)/(discovery)/discovery');
  };

  const handleSubmitReview = async (): Promise<void> => {
    if (!selectedRating || !orderData) return;

    await submitReview({
      orderId: orderData._id,
      restaurantId: orderData.restaurant._id,
      rating: selectedRating.value,
      description: comment.trim(),
    });
  };

  const getMainText = (): string => {
    if (currentStep === ReviewStep.RATING_SELECTION) {
      return 'How was the food?';
    }

    if (!selectedRating) return 'How was the food?';

    switch (selectedRating.value) {
      case 1:
      case 2:
        return 'Sorry to hear that. What went wrong?';
      case 3:
        return 'What could we improve?';
      case 4:
      case 5:
        return 'Fantastic to hear it went well!';
      default:
        return 'How was the food?';
    }
  };

  const getSubText = (): string => {
    if (currentStep === ReviewStep.RATING_SELECTION) {
      return 'Your feedback helps our restaurant partners improve their offering.';
    }
    return 'What did you especially enjoy?';
  };

  // ✅ Format order date properly
  const formatOrderDate = (): string => {
    if (orderData?.createdAt) {
      return new Date(orderData.createdAt).toLocaleDateString('en-GB');
    }
    if (orderDate) {
      return orderDate as string;
    }
    return new Date().toLocaleDateString('en-GB');
  };

  // ✅ Get restaurant info from real data
  const getRestaurantInfo = () => {
    if (orderData) {
      return {
        name: orderData.restaurant.name,
        image: orderData.restaurant.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&crop=center'
      };
    }

    // Fallback for params
    return {
      name: (restaurantName as string) || 'Restaurant',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&crop=center'
    };
  };

  const restaurantInfo = getRestaurantInfo();

  // ✅ Show loading state
  if (orderLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-600">Loading order details...</Text>
      </View>
    );
  }

  // ✅ Show error state
  if (orderError) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-5">
        <Text className="text-red-500 text-center mb-4">Error loading order details</Text>
        <TouchableOpacity
          onPress={handleSkipButton}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white">Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header with Back and Skip Button */}
      <View className="flex-row justify-between items-center px-6 pb-8 pt-4">
        {currentStep === ReviewStep.FEEDBACK_DETAILS ? (
          <TouchableOpacity onPress={handleBackToStep1}>
            <Text className="text-blue-500 text-lg">←</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-16" />
        )}
        <TouchableOpacity onPress={handleSkipButton}>
          <Text className="text-blue-500 text-lg">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Restaurant Image with Optional Selected Emoji */}
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-44 h-44 rounded-full overflow-hidden">
              <Image
                source={{ uri: restaurantInfo.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Selected Emoji Badge - Only show in Step 2 */}
            {currentStep === ReviewStep.FEEDBACK_DETAILS && selectedRating && (
              <View className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full justify-center items-center border-4 border-white">
                <Text className="text-4xl">{selectedRating.emoji}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ✅ Real Restaurant Info */}
        <Text className="text-center text-base text-black mb-8 font-medium">
          {restaurantInfo.name} • {formatOrderDate()}
        </Text>

        {/* Dynamic Main Text */}
        <Text className="text-center text-3xl font-bold text-black mb-4 px-6 leading-9">
          {getMainText()}
        </Text>

        {/* Dynamic Sub Text */}
        <Text className="text-center text-base text-gray-600 mb-12 px-8 leading-6">
          {getSubText()}
        </Text>

        {/* Step 1: Rating Emojis */}
        {currentStep === ReviewStep.RATING_SELECTION && (
          <View className="flex-row justify-around mb-12 px-5">
            {RATINGS.map((rating: Rating) => (
              <TouchableOpacity
                key={rating.id}
                onPress={() => handleRatingSelect(rating)}
                className="items-center"
                disabled={submitting}
              >
                <View className="w-20 h-20 rounded-full justify-center items-center mb-2">
                  <Text className="text-4xl">{rating.emoji}</Text>
                </View>
                <Text className="text-sm text-gray-600 text-center font-medium">
                  {rating.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Feedback Details */}
        {currentStep === ReviewStep.FEEDBACK_DETAILS && selectedRating && (
          <>
            {/* Comment Text Box */}
            <View className="mb-6 px-5">
              <View className="border border-blue-500 rounded-2xl p-4">
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Please give your review about the order..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  className="text-gray-800 text-base min-h-20"
                  textAlignVertical="top"
                  editable={!submitting}
                  maxLength={500}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1 text-right">
                {comment.length}/500
              </Text>
            </View>

            {/* Submit Button */}
            <View className="mb-4 px-5">
              <TouchableOpacity
                className={`${submitting ? 'bg-gray-400' : 'bg-blue-500'} rounded-full py-4 px-8`}
                onPress={handleSubmitReview}
                disabled={submitting || !selectedRating}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error message */}
            {submitError && (
              <View className="px-5 mb-4">
                <Text className="text-red-500 text-center text-sm">
                  {submitError}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderReview;
