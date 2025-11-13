import { gql, useQuery } from '@apollo/client';

export const MOST_ORDERED_FOODS = gql`
  query MostOrderedFoods($restaurantId: ID!) {
    mostOrderedFoods(restaurantId: $restaurantId) {
      id
      title
      description
      image
      price
      isAvailable
      isOutOfStock
      variations {
        title
        price
        discounted
        addons {
              id
              title
              price
            }
      }
    }
  }
`;
