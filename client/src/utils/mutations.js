import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

export const CREATE_ACCOUNT = gql`
  mutation createAccount($email: String!, $password: String!) {
    createAccount(email: $email, password: $password) {
      token
      account {
        _id
        email
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($profile: ProfileInput!) {
    updateProfile(profile: $profile) {
      _id
      username
    }
  }
`;

export const ADD_SCORE = gql`
  mutation addScore($score: ScoreInput!) {
    addScore(score: $score) {
      _id
      profile {
        _id
        username
      }
      moveCount
      ukeire
      efficiency
    }
  }
`;
