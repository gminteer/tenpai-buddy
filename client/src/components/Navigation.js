import React, {useState} from 'react';
import {Link, NavLink} from 'react-router-dom';

import Auth from 'utils/auth';

import Login from 'components/modals/Login';
import Signup from 'components/modals/Signup';

import styles from './Navigation.module.scss';

export default function Navigation({pages, authService}) {
  const isLoggedIn = authService.isLoggedIn();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

  const toggleLoginForm = () => setShowLoginForm(!showLoginForm);
  const toggleSignupForm = () => setShowSignupForm(!showSignupForm);
  const logOut = () => {
    Auth.logout();
    window.location.reload();
  };
  return (
    <>
      {showLoginForm && <Login toggle={toggleLoginForm} />}
      {showSignupForm && <Signup toggle={toggleSignupForm} />}
      <nav className={styles.Navigation}>
        {pages
          .filter((page) => page.navTitle)
          .map(({navTitle, path}) => (
            <NavLink key={path} activeClassName={styles.selected} to={path}>
              {navTitle}
            </NavLink>
          ))}
        {isLoggedIn ? (
          <>
            <Link to="/me">My Account</Link>
            <button onClick={logOut}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={toggleLoginForm}>Login</button>
            <button onClick={toggleSignupForm}>Signup</button>
          </>
        )}
      </nav>
    </>
  );
}
