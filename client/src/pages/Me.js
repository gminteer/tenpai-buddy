import React, {useEffect} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';
import {useSelector, useDispatch} from 'react-redux';

import Auth from 'utils/auth';
import {GET_MYACCOUNT} from 'utils/queries';
import {update} from 'slices/me';
import idbPromise from 'utils/idb';

import styles from './Me.module.scss';

export default function Me() {
  const me = useSelector((state) => state.me);
  const dispatch = useDispatch();
  const {loading, data} = useQuery(GET_MYACCOUNT);

  useEffect(() => {
    if (data) {
      idbPromise('me', 'put', data.myAccount);
      dispatch(update(data.myAccount));
    } else if (!loading) {
      const me = idbPromise('me', 'get');
      dispatch(update(me));
    }
  }, [data, loading, dispatch]);
  if (!Auth.isLoggedIn()) return <Redirect to="/" />;

  if (loading) return <div>Loading...</div>;
  return (
    <main className={styles.Me}>
      <h2>{me.email}</h2>
      {me.profile ? (
        <div>
          <h3>Profile</h3>
          <h4>Username</h4>
          <span>{me.profile.username}</span>
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
