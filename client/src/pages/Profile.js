import React from 'react';
import {Redirect, useParams} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';

import Auth from 'utils/auth';
import QUERY from 'utils/queries';

export default function Profile() {
  const {username: userParam} = useParams();
  const {loading, data} = useQuery(
    userParam ? QUERY.PROFILE : QUERY.MY_PROFILE,
    {
      variables: {username: userParam},
    }
  );
  if (!userParam && !Auth.isLoggedIn()) return <Redirect to="/" />;

  if (loading) return <div>Loading...</div>;
  const profile = data?.myProfile || data?.profile || {};
  const isProfileOwner =
    Auth.isLoggedIn() && Auth.decodedToken().data.profile === profile._id;
  if (userParam && isProfileOwner) return <Redirect to="/profile" />;

  if (!profile?.username)
    return (
      <main>
        <h2>User not found!</h2>
      </main>
    );

  return (
    <main>
      <h2>{profile.username}</h2>
    </main>
  );
}
