import { gql } from '@apollo/client';

export const ADD_RESTAURANT_TO_FAVOURITE = gql`
  mutation AddFavourite($id: String!) {
    addFavourite(id: $id) {
      _id
      favourite
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
    }
  }
`;
