import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

// This is a placeholder for your actual API submission logic.
// You would replace this with a call to your API service.
const submitFeedbackApi = async (data: {
  orderId: string;
  rating: number;
  review: string;
  tip: string;
}) => {
  console.log('Submitting feedback to API:', data);
  // Simulate a network request
  return new Promise(resolve => setTimeout(resolve, 1500));
};

export const useOrderRatingAndTip = (orderId: string) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      await submitFeedbackApi({
        orderId,
        rating,
        review,
        tip,
      });

      Alert.alert('Feedback Submitted', 'Thank you for your valuable feedback!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert(
        'Submission Failed',
        'We could not submit your feedback at this time. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rating,
    review,
    tip,
    isLoading,
    handleRatingChange,
    setReview,
    setTip,
    handleSubmit,
  };
};
