import { useQuery } from '@apollo/client';
import { MOST_ORDERED_FOODS } from '../graphql';

export const useMostOrderedFoods = (restaurantId: string) => {
  return useQuery(MOST_ORDERED_FOODS, {
    variables: { restaurantId },
  });
};
