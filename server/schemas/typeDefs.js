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

  type Score {
    _id: ID
    profile: Profile
    efficiency: Int
    ukeire: Int
    moveCount: Int
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

  input ScoreInput {
    moveCount: Int!
    efficiency: Int!
    ukeire: Int!
  }

  type Query {
    accounts: [Account]
    profile(username: String!): Profile
    myAccount: Account
    myProfile: Profile
    scores(profile: ID): [Score]
  }

  type Mutation {
    createAccount(email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateProfile(profile: ProfileInput!): Profile
    deleteProfile: Response
    addScore(score: ScoreInput!): Score
  }
`;
