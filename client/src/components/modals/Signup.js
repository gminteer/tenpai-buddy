import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';

import {CREATE_ACCOUNT} from 'utils/mutations';
import Auth from 'utils/auth';

import Modal from './Modal';

export default function Signup({toggle}) {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirm: '',
  });
  const [createAccount, {error}] = useMutation(CREATE_ACCOUNT);

  function handleChange(event) {
    const {name, value} = event.target;
    setFormState({...formState, [name]: value});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // TODO -- handle this better
    if (formState.password !== formState.confirm) {
      window.alert('Passwords do not match!');
      return;
    }
    try {
      const {confirm, ...variables} = formState;
      const {data} = await createAccount({variables});
      Auth.login(data.createAccount.token);
      window.location.assign('/me');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal toggle={toggle} title="Sign up">
      <form name="signup" onSubmit={handleSubmit}>
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
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}
