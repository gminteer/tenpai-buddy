import {ApolloServer} from 'apollo-server-express';
import express, {Application} from 'express';
import path from 'path';
import {buildSchema} from 'type-graphql';
import Container from 'typedi';

import {AccountResolver} from './resolvers/Account';
import {ProfileResolver} from './resolvers/Profile';
import {ScoreResolver} from './resolvers/Score';
import {RequestWithToken} from './types/RequestContext';
import {jwtMiddleware} from './utils/jwt';

const app = (async (): Promise<Application> => {
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AccountResolver, ProfileResolver, ScoreResolver],
      container: Container,
    }),
    context: ({req}: {req: RequestWithToken}) => ({req}),
  });

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(jwtMiddleware);
  apolloServer.applyMiddleware({app});

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (_req: express.Request, res: express.Response) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }
  return app;
})();

export default app;
