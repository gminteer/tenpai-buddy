import {DocumentType} from '@typegoose/typegoose';
import {AuthenticationError} from 'apollo-server-express';
import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql';

import {RequestContext} from '../contexts/RequestContext';
import {AccountModel, Account} from '../entities/Account';
import {Auth} from '../entities/Auth';
import {createJwt} from '../utils/auth';
import {AuthInput} from './types/AuthInput';

@Resolver()
export class AccountResolver {
  @Query(() => [Account])
  async accounts(): Promise<DocumentType<Account>[] | null> {
    return AccountModel.find();
  }

  @Authorized()
  @Query(() => Account, {nullable: true})
  async myAccount(@Ctx() ctx: RequestContext): Promise<DocumentType<Account>> {
    const account = await AccountModel.findById(ctx.req.token.sub).populate(
      'profile'
    );
    if (!account) throw new Error('Valid JWT, but no account found?!');
    return account;
  }

  @Mutation(() => Auth)
  async login(@Arg('data') {email, password}: AuthInput): Promise<Auth> {
    const account = await AccountModel.findOne({email});
    if (!account) throw new AuthenticationError('Invalid credentials');
    const pwIsValid = await account.comparePassword(password);
    if (!pwIsValid) throw new AuthenticationError('Invalid credentials');
    return {token: createJwt(account), account};
  }

  @Mutation(() => Auth)
  async createAccount(
    @Arg('data') {email, password}: AuthInput
  ): Promise<Auth> {
    const account = await AccountModel.create({email, password});
    return {token: createJwt(account), account};
  }
}
