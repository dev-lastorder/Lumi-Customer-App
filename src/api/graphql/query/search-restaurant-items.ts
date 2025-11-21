import { gql } from '@apollo/client';

export const SEARCH_STORE_ITEMS = gql`
  query searchFoodItemsWithParentAndSubCategory($input: SearchFoodItemsWithParentAndSubCategoryInput!) {
    searchFoodItemsWithParentAndSubCategory(input: $input) {
      parentCategory
      subCategories {
        title
        foods {
          title
          description
          image
          isOutOfStock
          createdAt
          updatedAt
        }
      }
      foods {
        title
        description
        image
        isOutOfStock
        createdAt
        updatedAt
      }
    }
  }
`;
