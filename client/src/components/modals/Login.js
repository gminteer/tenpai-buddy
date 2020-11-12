import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';

import {LOGIN} from 'utils/mutations';
import Auth from 'utils/auth';

import Modal from './Modal';

export default function Login({toggle}) {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [login, {error}] = useMutation(LOGIN);

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormState({...formState, [name]: value});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const {data} = await login({variables: {...formState}});
      Auth.login(data.login.token);
      window.location.assign('/me');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal toggle={toggle} title="Login">
      <form name="login" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}
