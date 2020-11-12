const express = require('express');
const path = require('path');
const {ApolloServer} = require('apollo-server-express');

const models = require('./models');
const {jwtAuth, signToken} = require('./utils/jwt');
const {typeDefs, resolvers} = require('./schemas')(models, signToken);

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: jwtAuth,
});
apolloServer.applyMiddleware({app});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/serviceWorker.js'));
  });
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

module.exports = app;
