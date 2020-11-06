import gql from 'graphql-tag';

const QUERY = {
  MY_ACCOUNT: gql`
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
  `,
  MY_PROFILE: gql`
    {
      myProfile {
        _id
        username
      }
    }
  `,
  PROFILE: gql`
    query profile($username: String!) {
      profile(username: $username) {
        _id
        username
      }
    }
  `,
};

export default QUERY;
