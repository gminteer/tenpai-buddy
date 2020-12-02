import {Field, ObjectType} from 'type-graphql';
import {Account} from './Account';

@ObjectType({description: 'Auth'})
export class Auth {
  @Field()
  public token!: string;
  @Field(() => Account)
  public account!: Account;
}
