import { gql } from '@apollo/client';

export const GET_ALL_CUISINES = gql`
    query GetAllCuisines($input: CuisineFilterInput) {
        getAllCuisines(input: $input) {
            cuisines {
                _id
                image
                name
                shopType
            }
        }
}
`;