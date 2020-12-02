import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';

import {DocumentType} from '@typegoose/typegoose';
import {Account} from '../entities/Account';

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRATION = '2h';

export const jwtMiddleware = expressJwt({
  secret: SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
  requestProperty: 'token',
});

export function createJwt(account: DocumentType<Account>): string {
  return jwt.sign({sub: account._id, profile: account.profile}, SECRET, {
    expiresIn: EXPIRATION,
  });
}
