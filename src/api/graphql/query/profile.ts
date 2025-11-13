import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query {
    profile {
      _id
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      notificationToken
      isActive
      isOrderNotification
      isOfferNotification
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
      favourite
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateUser($updateUserInput: UpdateUser!) {
    updateUser(updateUserInput: $updateUserInput) {
      name
      phone
      phoneIsVerified
      emailIsVerified
    }
  }
`;

export const GET_USER_FAVOURITE = gql`
  query UserFavourite {
    userFavourite {
      _id
      address
      image
      logo
      name
      rating
      isAvailable
      isActive
      deliveryTime
      minimumOrder
      shopType
    }
  }
`;
