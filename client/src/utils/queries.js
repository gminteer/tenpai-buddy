import gql from 'graphql-tag';

export const GET_MYACCOUNT = gql`
  {
    myAccount {
      _id
      email
      profile {
        _id
        username
      }
    }
  }
`;

export const NEW_TOKEN = gql`
  {
    newToken {
      token
      account {
        _id
        email
        profile {
          _id
          username
        }
      }
    }
  }
`;

export const GET_MYPROFILE = gql`
  {
    myProfile {
      _id
      username
    }
  }
`;

export const GET_PROFILE = gql`
  query profile($username: String!) {
    profile(username: $username) {
      _id
      username
    }
  }
`;

export const GET_SCORES = gql`
  {
    scores {
      _id
      profile {
        username
      }
      moveCount
      efficiency
      ukeire
    }
  }
`;
