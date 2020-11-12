import React from 'react';
import {Redirect, useParams} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';

import Auth from 'utils/auth';
import {GET_PROFILE} from 'utils/queries';

import styles from './Profile.module.scss';

export default function Profile() {
  const {username: userParam} = useParams();
  const {loading, data} = useQuery(GET_PROFILE, {
    variables: {username: userParam},
  });

  if (!userParam)
    if (Auth.isLoggedIn()) return <Redirect to="/me" />;
    else return <Redirect to="/" />;

  if (loading) return <div>Loading...</div>;
  const {profile} = data;

  const isProfileOwner =
    Auth.isLoggedIn() &&
    profile?._id &&
    Auth.decodedToken().data.profile === profile?._id;
  if (userParam && isProfileOwner) return <Redirect to="/me" />;
  if (!profile?.username)
    return (
      <main>
        <h2>User not found!</h2>
      </main>
    );

  return (
    <main className={styles.Profile}>
      <h2>{profile.username}</h2>
      <button>Edit Profile</button>
    </main>
  );
}
