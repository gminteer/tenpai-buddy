import {Field, ID, Int, ObjectType} from 'type-graphql';
import {getModelForClass, prop as Property, Ref} from '@typegoose/typegoose';

import {Account} from './Account';

@ObjectType({description: 'Profile'})
export class Profile {
  @Field(() => ID)
  public _id?: string;

  @Field(() => Account)
  @Property({ref: 'Account', required: true, unique: true})
  public account!: Ref<Account>;

  @Field()
  @Property({required: true, unique: true})
  public username!: string;

  @Field(() => Int, {nullable: true})
  @Property()
  public roundsPlayed?: number;
}

export const ProfileModel = getModelForClass(Profile);
