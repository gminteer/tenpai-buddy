import React from 'react';
import {Link} from 'react-router-dom';

import Navigation from './Navigation';

export default function Header({pages, authService}) {
  return (
    <header>
      <h1>
        <Link to="/">A Website</Link>
      </h1>
      <Navigation pages={pages} authService={authService} />
    </header>
  );
}
