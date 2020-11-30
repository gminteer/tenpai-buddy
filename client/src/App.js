import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {Provider as ReduxProvider} from 'react-redux';

import ApolloClient from 'apollo-boost';
import store from './slices';
import PagePicker from './pages';

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
        <PagePicker />
      </ApolloProvider>
    </ReduxProvider>
  );
}
