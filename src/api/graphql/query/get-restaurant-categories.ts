import { gql } from '@apollo/client';

export const GET_RESTAURANT_CATEGORIES_WITH_ITEMS = gql`
  query GetRestaurantCategoriesWithItems($input: GetRestaurantCategtegoryWithItemsInput!) {
    getRestaurantCategoriesWithItems(input: $input) {
      status
      error
      data {
        id
        title
        isActive
        data {
          id
          title
          description
          image
          isActive
          price
          isOutOfStock
          variations {
            id
            title
            price
            discounted
            isOutOfStock
            addons {
              id
              title
              price
            }
          }
        }
      }
    }
  }
`;

export const FETCH_CATEGORY_DETAILS_QUERY = gql`
  query FetchCategoryDetails($storeId: String!) {
    fetchCategoryDetailsByStoreIdForMobile(storeId: $storeId) {
      id
      category_name
      url
      food_id
    }
  }
`;