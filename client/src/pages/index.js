import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from 'components/Header';
import authService from 'utils/auth';
import Home from './Home';

const pages = [
  {
    path: '/me',
    navTitle: false,
    Page: React.lazy(() => import('./Me')),
  },
  {
    path: '/editProfile',
    navTitle: false,
    Page: React.lazy(() => import('./EditProfile')),
  },
  {
    path: '/profile/:username?',
    navTitle: false,
    Page: React.lazy(() => import('./Profile')),
  },
  {
    path: '/game',
    navTitle: 'Game',
    Page: React.lazy(() => import('./Game')),
  },
  {
    path: '/highscores',
    navTitle: 'High Scores',
    Page: React.lazy(() => import('./HighScores')),
  },
];

export default function PagePicker() {
  return (
    <Router>
      <Header pages={pages} authService={authService} />
      <Suspense fallback={<div>Now loading...</div>}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          {pages.map(({path, Page}) => (
            <Route exact path={path}>
              <Page />
            </Route>
          ))}
          <Route fallback>
            <div>Page not found!</div>
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}
