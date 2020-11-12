import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useSelector, useDispatch} from 'react-redux';

import Auth from 'utils/auth';
import {UPDATE_PROFILE} from 'utils/mutations';
import {GET_MYPROFILE} from 'utils/queries';
import {update} from 'slices/me';

export default function EditProfile() {
  const me = useSelector((state) => state.me);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({username: ''});
  const {loading, data} = useQuery(GET_MYPROFILE);
  const [updateProfile, {error}] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (data) setFormState(data.myProfile);
  }, [data]);

  if (!Auth.isLoggedIn()) return <Redirect to="/" />;
  if (loading) return <div>Loading...</div>;

  function handleChange(event) {
    const {name, value} = event.target;
    setFormState({...formState, [name]: value});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const {username} = formState;
    try {
      const profile = await updateProfile({variables: {profile: {username}}});
      dispatch(update({...me, profile}));
      window.location.assign('/me');
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <main>
      <form id="profile" name="profile" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            autoComplete="username"
            id="username"
            name="username"
            onChange={handleChange}
            value={formState?.username || ''}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
