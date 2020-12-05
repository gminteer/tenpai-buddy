import {DocumentType} from '@typegoose/typegoose';
import {Arg, Authorized, Ctx, Mutation, Query} from 'type-graphql';

import {RequestContext} from '../contexts/RequestContext';
import {AccountModel} from '../entities/Account';
import {GenericResponse} from '../entities/GenericResponse';
import {Profile, ProfileModel} from '../entities/Profile';
import {ProfileInput} from './types/ProfileInput';

export class ProfileResolver {
  @Query(() => Profile, {nullable: true})
  async profile(
    @Arg('username') username: string
  ): Promise<DocumentType<Profile> | null> {
    const profile = await ProfileModel.findOne({username});
    return profile ? profile : null;
  }

  @Authorized()
  @Query(() => Profile, {nullable: true})
  async myProfile(
    @Ctx() ctx: RequestContext
  ): Promise<DocumentType<Profile> | null> {
    const profile = await ProfileModel.findOne({account: ctx.req.token.sub});
    return profile ? profile : null;
  }

  @Authorized()
  @Mutation(() => Profile)
  async updateProfile(
    @Arg('data') data: ProfileInput,
    @Ctx() ctx: RequestContext
  ): Promise<DocumentType<Profile>> {
    const account = await AccountModel.findById(ctx.req.token.sub);
    if (!account) throw new Error('Valid JWT, but no account found?!');
    let profile = null;
    if (account.profile) {
      profile = await ProfileModel.findByIdAndUpdate(account.profile, data, {
        new: true,
      });
    }
    if (!profile) {
      profile = await ProfileModel.create({...data, account: account._id});
      account.profile = profile._id;
      await account.save();
    }
    return profile;
  }

  @Mutation(() => GenericResponse)
  async deleteProfile(
    @Ctx() ctx: RequestContext
  ): Promise<GenericResponse | null> {
    if (!ctx.req.token) return null;
    const account = await AccountModel.findById(ctx.req.token.sub);
    if (!account) throw new Error('Valid JWT, but no account found?!');
    if (!account.profile) return {ok: true, message: 'No profile to delete'};
    await ProfileModel.findByIdAndDelete(account.profile);
    account.profile = undefined;
    await account.save();
    return {ok: true, message: 'Profile deleted'};
  }
}
