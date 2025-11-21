// src/api/graphql/subscription/order.ts
import { gql } from '@apollo/client';

// ✅ Subscribe to order status changes for a specific user
export const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription OrderStatusChanged($userId: String!) {
    orderStatusChanged(userId: $userId) {
      userId
      origin
      order {
        _id
        orderId
        orderStatus
        orderAmount
        deliveryCharges
        tipping
        taxationAmount
        isPickedUp
        completionTime
        preparationTime
        expectedTime
        acceptedAt
        pickedAt
        deliveredAt
        assignedAt
        cancelledAt
        instructions
        
        restaurant {
          _id
          name
          image
          address
          location {
            coordinates
          }
        }
        
        deliveryAddress {
          location {
            coordinates
          }
          deliveryAddress
          details
          label
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
        
        user {
          _id
          name
          phone
        }
        
        rider {
          _id
          name
          phone
          location {
            coordinates
          }
        }
      }
    }
  }
`;

// ✅ Subscribe to specific order updates using _id
export const ORDER_UPDATES_SUBSCRIPTION = gql`
  subscription SubscriptionOrder($id: String!) {
    subscriptionOrder(id: $id) {
      _id
      orderId
      orderStatus
      orderAmount
      deliveryCharges
      tipping
      taxationAmount
      isPickedUp
      completionTime
      preparationTime
      expectedTime
      acceptedAt
      pickedAt
      deliveredAt
      assignedAt
      cancelledAt
      instructions
      
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
        details
        label
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
      
      user {
        _id
        name
        phone
      }
      
      rider {
        _id
        name
        phone
        location {
          coordinates
        }
      }
    }
  }
`;

// ✅ Subscribe to rider location updates using _id
export const RIDER_LOCATION_SUBSCRIPTION = gql`
  subscription SubscriptionRiderLocation($riderId: String!) {
    subscriptionRiderLocation(riderId: $riderId) {
      _id
      name
      phone
      available
      location {
        coordinates
      }
    }
  }
`;

export const CHAT_MESSAGE_SUBSCRIPTION = gql`
  subscription SubscriptionNewMessage($order: ID!) {
    subscriptionNewMessage(order: $order) {
      id
      message
      user {
        id
        name
      }
      createdAt
    }
  }
`;

