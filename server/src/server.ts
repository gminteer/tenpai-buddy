import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import connection from './utils/connection';
import app from './app';

const PORT = process.env.PORT || 3001;

connection.once('open', async () =>
  (await app).listen(PORT, () => console.info(`🌐 listening on ${PORT}`))
);
