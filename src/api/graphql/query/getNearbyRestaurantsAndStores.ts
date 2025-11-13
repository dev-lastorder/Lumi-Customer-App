import { gql } from '@apollo/client';

export const GET_NEARBY_RESTAURANTS_AND_STORE = gql`
  query GetNearbyRestaurantsOrStores($input: RestaurantOrStoreInput) {
    getNearbyRestaurantsOrStores(input: $input) {
      currentPage
      docsCount
      restaurants {
        _id
        deliveryTime
        image
        isAvailable
        location {
          coordinates
        }
        name
        minimumOrder
        reviewAverage
        reviewCount
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
        deliveryOptions {
          pickup
          delivery
        }
      }
      totalPages
    }
  }
`;

export const GET_NEARBY_RESTAURANTS_AND_STORE_COUNT = gql`
  query GetNearbyRestaurantsOrStoresCount($input: RestaurantOrStoreInput) {
    getNearbyRestaurantsOrStoresCount(input: $input) {
      docsCount
    }
  }
`;
