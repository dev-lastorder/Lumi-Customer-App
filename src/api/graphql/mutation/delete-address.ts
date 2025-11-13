import { gql } from '@apollo/client';

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($deleteAddressId: ID!) {
    deleteAddress(id: $deleteAddressId) {
      _id
    }
  }
`;
