import { gql } from '@apollo/client';

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($addressInput: AddressInput!) {
    createAddress(addressInput: $addressInput) {
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
