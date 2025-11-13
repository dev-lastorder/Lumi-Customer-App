// src/utils/interfaces/review.ts
export interface ReviewData {
    orderId: string;
    restaurantId: string;
    rating: number; // 1-5 star rating
    description?: string;
    aspects?: string[]; // For 4-5 star ratings
  }
  
  export interface ReviewSubmission {
    order: string; // Order ID
    rating: number;
    description: string;
  }
  
  export interface SubmittedReview {
    _id: string;
    rating: number;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    order: {
      _id: string;
      orderId: string;
      restaurant: {
        _id: string;
        name: string;
        image?: string;
      };
    };
  }
  
  export interface UseReviewSubmissionResult {
    submitReview: (reviewData: ReviewData) => Promise<void>;
    loading: boolean;
    error: string | null;
    success: boolean;
    submittedReview: SubmittedReview | null;
  }
  
  export interface ReviewFormProps {
    orderId: string;
    restaurantName?: string;
    restaurantImage?: string;
    orderDate?: string;
    onReviewSubmitted?: (review: SubmittedReview) => void;
    onSkip?: () => void;
  }