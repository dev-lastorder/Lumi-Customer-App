import { gql } from "@apollo/client";

export const NEAR_BY_RESTAURANTS_CUISINES = gql`
  query RestaurantCuisines($latitude: Float, $longitude: Float, $shopType: String) {
    nearByRestaurantsCuisines(
      latitude: $latitude
      longitude: $longitude
      shopType: $shopType
    ) {
        _id
        name
        shopType
    }
  }
`;