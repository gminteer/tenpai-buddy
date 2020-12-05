import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';

import {DocumentType} from '@typegoose/typegoose';
import {Account} from '../entities/Account';
import {AuthChecker} from 'type-graphql';
import {RequestContext} from '../contexts/RequestContext';

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRATION = '2h';

export function createJwt(account: DocumentType<Account>): string {
  return jwt.sign({sub: account._id}, SECRET, {
    expiresIn: EXPIRATION,
  });
}

export const jwtMiddleware = expressJwt({
  secret: SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
  requestProperty: 'token',
});

export const authChecker: AuthChecker<RequestContext> = ({context}, roles) => {
  if (!roles.length) {
    // only checking if user is logged in
    return !!context.req.token;
  } else {
    throw new Error('Not implemented!');
  }
};
