const {gql} = require('apollo-server-express');

module.exports = gql`
  type Profile {
    _id: ID
    username: String
  }

  type Account {
    _id: ID
    email: String
    profile: Profile
  }

  type Auth {
    token: ID!
    account: Account
  }

  type Response {
    ok: Boolean!
    statusCode: Int
    message: String
  }

  input ProfileInput {
    username: String!
  }

  type Query {
    accounts: [Account]
    profile(username: String!): Profile
    myAccount: Account
    myProfile: Profile
  }

  type Mutation {
    createAccount(email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateProfile(profile: ProfileInput!): Profile
    deleteProfile: Response
  }
`;
