// src/api/graphql/mutation/review.ts
import { gql } from '@apollo/client';

export const SUBMIT_REVIEW = gql`
  mutation SubmitReview($reviewInput: ReviewInput!) {
    reviewOrder(reviewInput: $reviewInput) {
      _id
      orderId
      orderStatus
      review {
        _id
        rating
        description
        isActive
        createdAt
        updatedAt
      }
      restaurant {
        _id
        name
        image
      }
      user {
        _id
        name
      }
    }
  }
`;

export const REVIEW_TIP = gql`
  mutation ReviewTip($reviewInput: ReviewTipInput!) {
    reviewAndTipOrder(reviewInput: $reviewInput) {
      _id
      acceptedAt
    }
  }
`;
