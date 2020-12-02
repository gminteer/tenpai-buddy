import {DocumentType} from '@typegoose/typegoose';
import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Service} from 'typedi';
import {AccountModel} from '../entities/Account';
import {Score, ScoreModel} from '../entities/Score';
import {RequestContext} from '../types/RequestContext';
import {ScoreInput} from './types/ScoreInput';

@Service()
@Resolver()
export class ScoreResolver {
  @Query(() => [Score])
  async scores(
    @Arg('profile', {nullable: true}) profile: string
  ): Promise<DocumentType<Score>[] | null> {
    if (profile) return ScoreModel.find({profile}).populate('profile');
    return ScoreModel.find().populate('profile');
  }

  @Mutation(() => Score)
  async addScore(
    @Arg('data') data: ScoreInput,
    @Ctx() ctx: RequestContext
  ): Promise<DocumentType<Score>> {
    let profile = null;
    if (ctx.req.token) {
      const user = await AccountModel.findById(ctx.req.token.sub);
      if (!user) throw new Error('Valid JWT, but no account found?!');
      profile = user.profile;
    }
    const score = await ScoreModel.create({...data, profile});
    return score;
  }
}
