import { gql } from '@apollo/client';

export const VALIDATE_COUPON = gql`
  mutation ValidateCoupon($coupon: String!) {
    coupon(coupon: $coupon) {
      _id
      title
      discount
      enabled
    }
  }
`;
