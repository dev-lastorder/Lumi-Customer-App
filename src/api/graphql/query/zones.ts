import { gql } from '@apollo/client';

export const GET_ZONES = gql(`query zonesCentral {
  zonesCentral {
    _id
    title
    location {
      coordinates
    }
  }
}`);
