// api/graphql/query/activeOrders.ts - Fixed GraphQL queries

import { gql } from '@apollo/client';

// Fragment for order data to ensure consistency across queries and subscriptions
const ORDER_FRAGMENT = gql`
  fragment OrderData on Order {
    _id
    orderId
    restaurant {
      _id
      name
      image
      address
      location {
        coordinates
      }
    }
    orderStatus
    orderDate
    completionTime
    preparationTime
    expectedTime
    isPickedUp
    rider {
      _id
      name
      phone
    }
    items {
      _id
      title
      quantity
      variation {
        title
        price
      }
      addons {
        _id
        title
        options {
          _id
          title
          price
        }
      }
    }
    orderAmount
    deliveryCharges
    tipping
    taxationAmount
    instructions
    createdAt
    updatedAt
    deliveryAddress {
      deliveryAddress
      details
      label
      location {
        coordinates
      }
    }
  }
`;

// Query to get user's undelivered (active) orders
export const GET_ACTIVE_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query GetActiveOrders($offset: Int) {
    undeliveredOrders(offset: $offset) {
      ...OrderData
    }
  }
`;

// Alternative query using orders with user filtering (if undeliveredOrders doesn't work)
export const GET_USER_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query GetUserOrders($offset: Int) {
    orders(offset: $offset) {
      ...OrderData
    }
  }
`;

// Subscription for real-time order updates
export const ORDER_STATUS_SUBSCRIPTION = gql`
  ${ORDER_FRAGMENT}
  subscription OrderStatusChanged($userId: String!) {
    orderStatusChanged(userId: $userId) {
      userId
      origin
      order {
        ...OrderData
      }
    }
  }
`;

export const ALL_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query Orders {
    orders {
      ...OrderData
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query Order($orderId: String!) {
    order(id: $orderId) {
      _id
      orderId
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      orderStatus
      orderDate
      completionTime
      preparationTime
      expectedTime
      isPickedUp
      rider {
        _id
        name
        phone
      }
      items {
        _id
        food
        title
        image
        quantity
        variation {
          _id
          discounted
          title
          price
        }
        addons {
          _id
          title
          options {
            _id
            title
            price
          }
        }
      }
      orderAmount
      deliveryCharges
      tipping
      taxationAmount
      instructions
      createdAt
      updatedAt
      deliveryAddress {
        deliveryAddress
        details
        label
        location {
          coordinates
        }
      }
      acceptedAt
      assignedAt
      cancelledAt
      deliveredAt
      id
      isActive
      isRiderRinged
      isRinged
      paidAmount
      paymentMethod
      paymentStatus
      pickedAt
      reason
      status
      review {
        _id
        createdAt
        description
        isActive
        rating
        updatedAt
      }
      selectedPrepTime
    }
  }
`;
