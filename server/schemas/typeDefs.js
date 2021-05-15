const { gql } = require("apollo-server-express");

/*

User - it can be provider / consumer
Parking place is master table for Parking Detail. as its info rarely get change
Invetory represents providers entry for parking availabilty it can be durarion or one day.
Reservation represents when Parking taken by Consumer and did payment process.

*/
const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    phone: Int
    parkingPlace: [ParkingPlace]
  }

  type ParkingPlace {
    _id: ID
    apt: String
    street: String
    city: String
    state: String
    zip: String
    isCoveredParking: Boolean
    capacity: Int
    price: Int
    provider: User
    reservations: [Reservation]
  }

  type Inventory {
    _id: ID
    startDate: String
    endDate: String
    parkingPlace: ParkingPlace
  }

  type Reservation {
    _id: ID
    startDate: String
    endDate: String
    parkingPlace: ParkingPlace
    consumer: User
    stripeTransaction: String
  }

  type Auth {
    token: ID
    user: User
  }

 
type Query {
    inventory(parkingPlace: ID): [Inventory]
    getAllParking(startDate:String): [ParkingPlace]
    getParkingById(startDate:String!,parkingPlace:ID!) : ParkingPlace
    getParkingByInventoryId(_id:ID!):ParkingPlace
    getAllInventory(_id : ID!) : User
    getActiveReservation(startDate:String): [ParkingPlace]
    user: User

}


type Mutation {
  
  addUser(
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String!
  ): Auth

  addParkingPlace(
    apt: String!
    street: String!
    city: String!
    state: String!
    zip: String!
    isCoveredParking: Boolean!
    capacity: Int!
    price: Int!
  ): ParkingPlace

  login(email: String!, password: String!): Auth
}
`;

module.exports = typeDefs;
