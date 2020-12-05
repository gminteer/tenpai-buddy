import bcrypt from 'bcrypt';
import {Field, ID, ObjectType} from 'type-graphql';
import {
  pre as PreHook,
  prop as Property,
  getModelForClass,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';

import {Profile} from './Profile';

const SALT_ROUNDS = 10;

@ObjectType({description: 'Account'})
@PreHook<Account>('save', async function (this: DocumentType<Account>, next) {
  if (this.isNew || this.isModified('password'))
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
})
export class Account {
  @Field(() => ID)
  public _id?: string;

  @Field()
  @Property({
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Invalid email address'],
  })
  public email!: string;

  @Field()
  @Property({required: true})
  public password!: string;

  @Field(() => Profile, {nullable: true})
  @Property({ref: () => Profile, unique: true})
  public profile?: Ref<Profile>;

  public async comparePassword(
    this: DocumentType<Account>,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
export const AccountModel = getModelForClass(Account);
