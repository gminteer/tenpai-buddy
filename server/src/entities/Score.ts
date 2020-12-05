import {Field, Float, ID, Int, ObjectType} from 'type-graphql';
import {getModelForClass, prop as Property, Ref} from '@typegoose/typegoose';
import {Profile} from './Profile';

@ObjectType({description: 'Score'})
export class Score {
  @Field(() => ID)
  public _id?: string;

  @Field(() => Profile, {nullable: true})
  @Property({ref: () => Profile})
  public profile?: Ref<Profile>;

  @Field(() => Float)
  @Property()
  public efficiency!: number;

  @Field(() => Int)
  @Property()
  public ukeire!: number;

  @Field(() => Int)
  @Property()
  public moveCount!: number;
}

export const ScoreModel = getModelForClass(Score);
