import {Request} from 'express';

export interface Token {
  sub: string;
}

export interface RequestWithToken extends Request {
  token: Token;
}
