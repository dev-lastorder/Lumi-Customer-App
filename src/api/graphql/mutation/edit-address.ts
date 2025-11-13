import { gql } from '@apollo/client';

export const EDIT_ADDRESS = gql`
  mutation EditAddress($addressInput: AddressInput!) {
    editAddress(addressInput: $addressInput) {
      name
      _id
      zone {
        title
        _id
        isActive
        location {
          coordinates
        }
      }
    }
  }
`;
