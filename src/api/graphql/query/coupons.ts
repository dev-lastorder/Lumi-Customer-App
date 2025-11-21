import { gql } from '@apollo/client';

export const GET_COMBINED_COUPONS = gql`
  query GetCoupons($page: Int, $limit: Int, $lat: Float, $lng: Float, $zoneCoordinates: ZoneCoordinatesInput) {
    getCouponsCombinedByStoreAndCoupons(page: $page, limit: $limit, lat: $lat, lng: $lng, zoneCoordinates: $zoneCoordinates) {
      currentPage
      nextPage
      prevPage
      totalData
      totalPages
      data {
        discount
        enabled
        _id
        isActive
        restaurantId
        restaurantType
        title
        endDate
        lifeTimeActive
        startDate
        createdAt
      }
    }
  }
`;

export const GET_RESTAURANT_COUPONS = gql`
  query RestaurantCoupons($restaurantId: String!) {
    restaurantCoupons(restaurantId: $restaurantId) {
      _id
      title
      discount
      enabled
      startDate
      endDate
      lifeTimeActive
    }
  }
`;
