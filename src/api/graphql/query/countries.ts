import { gql } from '@apollo/client';

export const GET_COUNTRIES_DROPDOWN = gql`
  query GetCountriesForDropdown {
    getCountriesDropdown {
      key
      label
      value
    }
  }
`;
