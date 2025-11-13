import { gql } from '@apollo/client';

export const GET_FILTERED_RESTAURANTS = gql`
  query GetFilteredRestaurants($input: FilterInput) {
      getFilteredRestaurants(input: $input) {
        restaurants {
          _id
          name
          image
          address
          deliveryTime
          reviewCount
          reviewAverage
          shopType
          isAvailable
        }
        foods {
          id
          title
          image
          description
          isActive
          price
          currency
          restaurantId
          restaurantName
          isOutOfStock
          variations {
            id
            title
            price
            addons {
              id
              title
              price
            }
          }
        }
        currentPage
        docsCount
        totalPages
      }
    }
`;
