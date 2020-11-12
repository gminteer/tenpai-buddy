import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ApolloProvider} from '@apollo/react-hooks';
import {Provider as ReduxProvider} from 'react-redux';

import ApolloClient from 'apollo-boost';

import authService from './utils/auth';
import store from './slices';

import Home from './pages/Home';
import Header from './components/Header';

const Me = React.lazy(() => import('./pages/Me'));
const Profile = React.lazy(() => import('./pages/Profile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const Game = React.lazy(() => import('./pages/Game'));
const HighScores = React.lazy(() => import('./pages/HighScores'));

const client = new ApolloClient({
  request(operation) {
    const token = localStorage.getItem('jwt');
    operation.setContext({
      headers: {authorization: token ? `Bearer ${token}` : ''},
    });
  },
  uri: '/graphql',
});

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <Router>
          <Header pages={['game', 'highscores']} authService={authService} />
          <Suspense fallback={<div>Now loading...</div>}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/me">
                <Me />
              </Route>
              <Route exact path="/editProfile">
                <EditProfile />
              </Route>
              <Route exact path="/profile/:username?">
                <Profile />
              </Route>
              <Route exact path="/game">
                <Game />
              </Route>
              <Route exact path="/highscores">
                <HighScores />
              </Route>
              <Route fallback>
                <div>Page not found!</div>
              </Route>
            </Switch>
          </Suspense>
        </Router>
      </ApolloProvider>
    </ReduxProvider>
  );
}
