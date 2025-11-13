import { gql } from '@apollo/client';

export const GET_SHOP_TYPES = gql`
  query FetchShopTypes($filter: FetchShopTypeFilter, $pagination: PaginationInput) {
    fetchShopTypes(filter: $filter, pagination: $pagination) {
      data {
        _id
        title
        image
        isActive
      }
      total
      page
      pageSize
      totalPages
      hasNextPage
      hasPrevPage
    }
  }
`;
