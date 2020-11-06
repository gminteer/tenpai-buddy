module.exports = (models, signToken) => ({
  typeDefs: require('./typeDefs'),
  resolvers: require('./resolvers')(models, signToken),
});
