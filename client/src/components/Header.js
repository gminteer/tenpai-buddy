import React from 'react';
import {Link} from 'react-router-dom';

import Navigation from './Navigation';

import styles from './Header.module.scss';

export default function Header({pages, authService}) {
  return (
    <header className={styles.Header}>
      <h1>
        <Link to="/">Tenpai Buddy!</Link>
      </h1>
      <Navigation pages={pages} authService={authService} />
    </header>
  );
}
