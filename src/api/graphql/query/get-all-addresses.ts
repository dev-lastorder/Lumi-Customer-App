// GraphQL Query
import { gql } from '@apollo/client';

export const GET_ALL_ADDRESSES = gql`
  query Addresses {
    profile {
      addresses {
        _id
        deliveryAddress
        details
        label
        selected
        location {
          coordinates
        }
        zone {
          _id
          title
          isActive
        }
      }
    }
  }
`;
