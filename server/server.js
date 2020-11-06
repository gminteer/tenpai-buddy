require('dotenv').config();

const connection = require('./config/connection');
const app = require('./app');

const PORT = process.env.PORT || 3001;

connection.once('open', () =>
  app.listen(PORT, () => console.info(`🌐 listening on ${PORT}`))
);
