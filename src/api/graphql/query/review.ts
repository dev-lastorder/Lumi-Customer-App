import { gql } from '@apollo/client';

export const GET_RESTAURANT_REVIEWS = gql`
  query GetRestaurantReviews($restaurant: String!) {
    reviewsByRestaurant(restaurant: $restaurant) {
      reviews {
        _id
        order {
            user {
                _id
                name
            }
        }
        # restaurant: Restaurant!
        rating
        description
        isActive
        createdAt
        updatedAt
      }
      ratings
      total
    }
  }
`;

export const GET_ORDER_FOR_REVIEW = gql`
  query GetOrderForReview($id: String!) {
    order(id: $id) {
      _id
      orderId
      orderStatus
      restaurant {
        _id
        name
        image
        address
      }
      items {
        _id
        title
        quantity
        variation {
          title
          price
        }
      }
      orderAmount
      deliveryCharges
      tipping
      taxationAmount
      createdAt
      review {
        _id
        rating
        description
        createdAt
      }
    }
  }
`;

export const GET_USER_REVIEWS = gql`
  query GetUserReviews($offset: Int) {
    reviews(offset: $offset) {
      _id
      rating
      description
      isActive
      createdAt
      updatedAt
      order {
        _id
        orderId
        restaurant {
          _id
          name
          image
        }
        orderAmount
        createdAt
      }
    }
  }
`;
