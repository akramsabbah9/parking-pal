import gql from "graphql-tag";

export const QUERY_USER = gql`
    {
        user {
            _id
            firstName
            lastName
            email
            phone
            parkingPlace {
                _id
                apt
                street
                city
                state
                zip
                isCoveredParking
                capacity
            }
        }
    }
`;

export const QUERY_ALL_PARKING = gql`
    {
        getAllParking {
            _id
            apt
            street
            city
            state
            zip
            isCoveredParking
        }
    }
`;

export const INVENTORY_HISTORY = gql`
    {
        getAllInventoriesByProviderID {
            _id
            startDate
            price
            isAvailable
            parkingPlace {
                _id
                apt
                street
                city
                state
                zip
                isCoveredParking
                capacity
            }
        }
    }
`;
