import { gql } from '@apollo/client';

export const GET_RESTAURANT_MENU_QUERY = gql`
  query GetRestaurantCategoriesAndSubCategoriesWithItems($input: GetRestaurantCategtegoryWithItemsInput!) {
    getRestaurantCategoriesAndSubCategoriesWithItems(input: $input) {
      status
      error
      data {
        subCategories {
          id
          title
        }
        products {
          id
          title
          description
          price
          variations {
            id
            title
            price
            discounted
            addons {
              id
              title
              price
            }
            isOutOfStock
          }
          image
          isActive
          isOutOfStock
          categoryId
          subCategoryId
        }
        categories {
          id
          title
        }
      }
    }
  }
`;
