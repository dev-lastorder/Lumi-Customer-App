import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORDER_BY_ID } from '@/api/graphql/query/active0rders';
import { REVIEW_TIP } from '@/api/graphql/mutation/review';
import { API_ENDPOINT } from '@/utils/constants';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

export const usePastOrderRating = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const { data, loading, error, refetch } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId },
    fetchPolicy: 'cache-and-network',
    skip: !orderId,
  });

  const [reviewTip] = useMutation(REVIEW_TIP);

  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tip, setTip] = useState('0');
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tempComment, setTempComment] = useState('');
  const [tempTip, setTempTip] = useState(tip);

  useEffect(() => {
    if (data?.order) {
      const { order } = data;
      setTip(order.tipping ? order.tipping : '0');
      setTempTip(order.tipping ? order.tipping : '0');
      if (order?.review?.rating) {
        setRating(order.review.rating);
      }
    }
  }, [data]);

  const handleSubmit = async (canReview: boolean) => {
    if (canReview && !rating) return;
    setIsLoading(true);
    try {
      if (canReview) {
        const reviewInput = {
          description: comment,
          rating,
          order: orderId,
          tip: Number(tip),
        };
        const { data: reviewData } = await reviewTip({ variables: { reviewInput } });
        if (!reviewData?.reviewAndTipOrder) {
          Alert.alert('Error', 'Failed to submit review.');
          setIsLoading(false);
          return;
        }
      }

      if (Number(tip) > 0) {
        const url = `${API_ENDPOINT[process.env.NODE_ENV === 'production' ? 'PROD' : 'LOCAL'].SERVER_URL}stripe/tip/send?orderId=${orderId}&tipAmount=${tip}`;
        // const url = `${API_ENDPOINT[process.env.NODE_ENV === 'production' ? 'PROD' : 'LOCAL'].SERVER_URL}stripe/tip/send?orderId=684adf583da3eb41a3429958&tipAmount=${tip}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            const { sessionUrl } = await response.json();
            if (sessionUrl) {
              Alert.alert('Success', canReview ? 'Review submitted. Redirecting to payment...' : 'Redirecting to payment...');
              await WebBrowser.openBrowserAsync(sessionUrl);
              router.back();
            } else {
              Alert.alert('Error', canReview ? 'Review submitted, but could not retrieve payment session.' : 'Could not retrieve payment session.');
            }
          } else {
            const errorData = await response.text();
            Alert.alert(
              'Error',
              canReview ? `Review submitted, but could not process tip payment: ${errorData}` : `Could not process tip payment: ${errorData}`
            );
          }
        } catch (error) {
          Alert.alert(
            'Error',
            canReview
              ? `Review submitted, but an error occurred while trying to process the tip: ${error}`
              : `An error occurred while trying to process the tip: ${error}`
          );
        }
      } else if (canReview) {
        Alert.alert('Success', 'Your review has been submitted.');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred during submission: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveComment = (newComment: string) => {
    setComment(newComment);
    setShowCommentModal(false);
  };

  const handleSaveTip = (newTip: string) => {
    setTip(newTip);
    setShowTipModal(false);
  };

  return {
    rating,
    setRating,
    isLoading,
    tip,
    comment,
    showCommentModal,
    setShowCommentModal,
    showTipModal,
    setShowTipModal,
    tempComment,
    setTempComment,
    tempTip,
    setTempTip,
    handleSubmit,
    handleSaveComment,
    handleSaveTip,
    restaurant: data?.order?.restaurant,
    order: data?.order,
    loading,
    error,
    refetch,
  };
};
