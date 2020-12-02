import {Request} from 'express';
import {Token} from './Token';

export interface RequestWithToken extends Request {
  token: Token;
}

export interface RequestContext {
  req: RequestWithToken;
}
