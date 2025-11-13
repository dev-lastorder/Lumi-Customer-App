// src/hooks/useReviewSubmission.ts
import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import { SUBMIT_REVIEW } from '@/api/graphql/mutation/review';
import { 
  ReviewData, 
  UseReviewSubmissionResult, 
  SubmittedReview 
} from '@/utils/interfaces/review';

export const useReviewSubmission = (orderId: string): UseReviewSubmissionResult => {
  const [success, setSuccess] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<SubmittedReview | null>(null);
  
  // Check if this is a dummy order (for testing purposes)
  const isDummyOrder = !orderId || orderId.includes('dummy') || orderId.length < 20;
  
  // Submit review mutation - Skip if dummy
  const [submitReviewMutation, { loading: submitting, error }] = useMutation(SUBMIT_REVIEW, {
    onCompleted: (data) => {
      if (data?.reviewOrder?.review) {
        const review: SubmittedReview = {
          _id: data.reviewOrder.review._id,
          rating: data.reviewOrder.review.rating,
          description: data.reviewOrder.review.description,
          isActive: data.reviewOrder.review.isActive,
          createdAt: data.reviewOrder.review.createdAt,
          updatedAt: data.reviewOrder.review.updatedAt,
          order: {
            _id: data.reviewOrder._id,
            orderId: data.reviewOrder.orderId,
            restaurant: {
              _id: data.reviewOrder.restaurant._id,
              name: data.reviewOrder.restaurant.name,
              image: data.reviewOrder.restaurant.image,
            }
          }
        };
        
        setSubmittedReview(review);
        setSuccess(true);
        
        Alert.alert(
          'Review Submitted!',
          'Thank you for your feedback. It helps us improve our service.',
          [{ text: 'OK' }]
        );
      }
    },
    onError: (error) => {
      
      Alert.alert(
        'Submission Failed',
        'Unable to submit your review. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const submitReview = useCallback(async (reviewData: ReviewData) => {
    if (isDummyOrder) {
      // Simulate successful submission for dummy orders
      const dummyReview: SubmittedReview = {
        _id: `dummy-review-${Date.now()}`,
        rating: reviewData.rating,
        description: reviewData.description || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: {
          _id: orderId,
          orderId: orderId,
          restaurant: {
            _id: 'dummy-restaurant',
            name: "McDonald's Downtown",
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
          }
        }
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmittedReview(dummyReview);
      setSuccess(true);
      
      Alert.alert(
        'Review Submitted! (Demo)',
        'Thank you for your feedback. This is a demo submission.',
        [{ text: 'OK' }]
      );
      
      return;
    }

    // Validation
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      Alert.alert('Invalid Rating', 'Please select a rating between 1 and 5 stars.');
      return;
    }

    if (reviewData.description && reviewData.description.length > 500) {
      Alert.alert('Review Too Long', 'Please keep your review under 500 characters.');
      return;
    }

    try {
      await submitReviewMutation({
        variables: {
          reviewInput: {
            order: reviewData.orderId,
            rating: reviewData.rating,
            description: reviewData.description || '',
          },
        },
      });
    } catch (err) {
      
    }
  }, [orderId, isDummyOrder, submitReviewMutation]);

  return {
    submitReview,
    loading: !isDummyOrder && submitting,
    error: !isDummyOrder && error?.message || null,
    success,
    submittedReview,
  };
};