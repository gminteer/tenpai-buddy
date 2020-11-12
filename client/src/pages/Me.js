import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';

import Auth from 'utils/auth';
import {GET_MYACCOUNT} from 'utils/queries';

export default function Me() {
  const {loading, data} = useQuery(GET_MYACCOUNT);

  if (!Auth.isLoggedIn()) return <Redirect to="/" />;

  if (loading) return <div>Loading...</div>;
  const {myAccount} = data;
  const {profile} = myAccount;
  return (
    <main>
      <h2>{myAccount.email}</h2>
      {profile ? (
        <div>
          <h3>Profile</h3>
          <h4>Username</h4>
          <span>{profile.username}</span>
          <Link to="/profile/edit">Edit Profile</Link>
        </div>
      ) : (
        <div>
          <h3>No profile created</h3>
          <p>
            You haven't created a profile yet,{' '}
            <Link to="/profile/edit">click here</Link> to create one. Creating a
            profile will unlock posting high scores, with more features coming
            soon!
          </p>
        </div>
      )}
    </main>
  );
}
