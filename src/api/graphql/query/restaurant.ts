import { gql } from '@apollo/client';

// =================================================================
// ==========================   fragments
// =================================================================

export const RESTAURANT_PREVIEW_FRAGMENT = gql`
  fragment RestaurantPreviewFields on RestaurantPreview {
    _id
    name
    logo
    image
    deliveryTime
    minimumOrder
    rating
    shopType
    options {
      _id
      description
      isOutOfStock
      price
      title
    }
    addons {
      _id
      description
      isOutOfStock
      options
      quantityMaximum
      quantityMinimum
      title
    }
    categories {
      _id
      foods {
        _id
        currency
        description
        image
        isActive
        isOutOfStock
        price
        restaurantId
        restaurantName
        subCategory
        title
        updatedAt
        variations {
          _id
          addons
          discounted
          isOutOfStock
          price
          title
        }
      }
    }
  }
`;

export const RESTAURANT_DETAILS_FRAGMENT = gql`
  fragment RestaurantDetailsFields on Restaurant {
    _id
    name
    rating
    reviewCount
    reviewAverage
    image
    logo
    shopType
    deliveryTime
    minimumOrder
    address
    location {
      coordinates
    }
    deliveryInfo {
      minDeliveryFee
      deliveryDistance
      deliveryFee
    }
    openingTimes {
      day
      times {
        startTime
        endTime
      }
    }
    categories {
      _id
      createdAt
      image
      title
      updatedAt
      foods {
        _id
        createdAt
        description
        image
        isActive
        isOutOfStock
        subCategory
        title
        updatedAt
      }
    }
  }
`;

// =================================================================
// ==========================   Qeuries
// =================================================================

export const GET_RESTAURANTS_PREVIEWS = gql`
  ${RESTAURANT_PREVIEW_FRAGMENT}
  query Restaurants($latitude: Float, $longitude: Float, $shopType: [String!]!, $pagination: PaginationInput) {
    nearByRestaurantsPreview(latitude: $latitude, longitude: $longitude, shopType: $shopType, pagination: $pagination) {
      shopType
      cuisines {
        _id
        name
        description
        image
        shopType
      }
      restaurants {
        cuisines
        ...RestaurantPreviewFields
      }
    }
  }
`;

export const GET_RECENT_ORDER_RESTAURANTS_PREVIEW = gql`
  ${RESTAURANT_PREVIEW_FRAGMENT}
  query RecentOrderRestaurantsPreview($latitude: Float!, $longitude: Float!, $pagination: PaginationInput) {
    recentOrderRestaurantsPreview(latitude: $latitude, longitude: $longitude, pagination: $pagination) {
      ...RestaurantPreviewFields
    }
  }
`;

export const GET_MOST_ORDER_RESTAURANTS_PREVIEW = gql`
  ${RESTAURANT_PREVIEW_FRAGMENT}
  query GetMostOrderedRestaurants($latitude: Float!, $longitude: Float!, $shopType: [String!], $pagination: PaginationInput) {
    mostOrderedRestaurantsPreview(latitude: $latitude, longitude: $longitude, shopType: $shopType, pagination: $pagination) {
      shopType
      restaurants {
        ...RestaurantPreviewFields
      }
    }
  }
`;

export const GET_TOP_RATED_VENDORS_PREVIEW = gql`
  ${RESTAURANT_PREVIEW_FRAGMENT}
  query TopRatedVendorsPreview($latitude: Float!, $longitude: Float!, $shopType: [String!], $pagination: PaginationInput) {
    topRatedVendorsPreview(latitude: $latitude, longitude: $longitude, shopType: $shopType, pagination: $pagination) {
      shopType
      restaurants {
        ...RestaurantPreviewFields
      }
    }
  }
`;

export const GET_RESTAURANT_DETAILS = gql`
  ${RESTAURANT_DETAILS_FRAGMENT}
  query Restaurant($id: String!) {
    restaurant(id: $id) {
      ...RestaurantDetailsFields
    }
  }
`;

export const GET_RECOMMENDED_FOOD_ITEMS = gql`
  query GetRecommendedFoodItems($input: RecommendedFoodItemsInput) {
    getRecommendedFoodItems(input: $input) {
      currentPage
      totalCount
      totalPages
      items {
        id
        createdAt
        description
        image
        isActive
        isOutOfStock
        subCategory
        title
        updatedAt
        restaurantId
        price
        variations {
          _id
          addons
          discounted
          isOutOfStock
          price
          title
        }
      }
    }
  }
`;

export const GET_RECOMMENDED_ITEMS_FOR_ORDER_DETAIL_SCREEN = gql`
  query RecommendedItems($itemId: String!, $restaurantId: String!, $page: Int) {
    recommendedItems(itemId: $itemId, restaurantId: $restaurantId, page: $page) {
      currentPage
      totalPages
      totalItems
      items {
        food
        createdAt
        description
        image
        isActive
        isOutOfStock
        subCategory
        title
        updatedAt
        variation {
          _id
          discounted
          price
          title
          isOutOfStock
        }
        addons {
          _id
          description
          isOutOfStock
          title
          quantityMaximum
          quantityMinimum
        }
      }
    }
  }
`;

export const GET_RESTAURANT_FOR_CHECKOUT_SCREEN = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      name
      deliveryTime
      stripeDetailsSubmitted
      minimumOrder
      tax
      address
      location {
        coordinates
      }
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
      location {
        coordinates
      }
      deliveryOptions {
        pickup 
        delivery
      }
    }
  }
`;
