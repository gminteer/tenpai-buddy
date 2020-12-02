import {Field, InputType} from 'type-graphql';

import {Account} from '../../entities/Account';

@InputType()
export class AuthInput implements Partial<Account> {
  @Field()
  public email!: string;

  @Field()
  public password!: string;
}
