// src/api/graphql/query/order.ts
import { gql } from '@apollo/client';

// ✅ Main query for order tracking - uses _id
export const GET_ORDER_DETAILS = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      _id
      orderId
      orderStatus
      orderAmount
      deliveryCharges
      tipping
      taxationAmount
      isPickedUp
      instructions
      paymentMethod
      paymentStatus
      reason
      isActive
      createdAt
      updatedAt
      completionTime
      preparationTime
      expectedTime
      acceptedAt
      pickedAt
      deliveredAt
      assignedAt
      cancelledAt
      selectedPrepTime
      isRinged
      isRiderRinged
      
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
        shopType
        reviewCount
        reviewAverage
        keywords
        tags
      }
      
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
        id
      }
      
      items {
        _id
        id
        title
        food
        description
        image
        quantity
        specialInstructions
        isActive
        createdAt
        updatedAt
        variation {
          _id
          id
          title
          price
          discounted
        }
        addons {
          _id
          id
          title
          description
          quantityMinimum
          quantityMaximum
          options {
            _id
            id
            title
            description
            price
          }
        }
      }
      
      user {
        _id
        name
        phone
        phoneIsVerified
        email
        emailIsVerified
      }
      
      rider {
        _id
        name
        phone
        image
        available
        location {
          coordinates
        }
      }
      
      review {
        _id
        rating
        description
        isActive
        createdAt
        updatedAt
      }
      
      zone {
        _id
        title
        description
        isActive
      }
    }
  }
`;

// ✅ Query for order review screen
export const GET_ORDER_FOR_REVIEW = gql`
  query GetOrderForReview($id: String!) {
    order(id: $id) {
      _id
      orderId
      orderStatus
      orderAmount
      deliveryCharges
      tipping
      taxationAmount
      createdAt
      orderDate
      
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      
      items {
        _id
        title
        description
        image
        quantity
        variation {
          title
          price
          discounted
        }
        addons {
          title
          options {
            title
            price
          }
        }
      }
      
      user {
        _id
        name
        email
      }
      
      review {
        _id
        rating
        description
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

// ✅ Query rider location using _id
export const GET_RIDER_LOCATION = gql`
  query GetRider($id: String!) {
    rider(id: $id) {
      _id
      name
      phone
      image
      available
      isActive
      location {
        coordinates
      }
      zone {
        _id
        title
      }
    }
  }
`;

// ✅ Query user profile
export const GET_USER_PROFILE = gql`
  query GetProfile {
    profile {
      _id
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      isActive
      isOrderNotification
      isOfferNotification
      favourite
      notificationToken
      addresses {
        _id
        deliveryAddress
        details
        label
        selected
        location {
          coordinates
        }
      }
    }
  }
`;