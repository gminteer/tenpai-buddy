import {Field, InputType} from 'type-graphql';

import {Profile} from '../../entities/Profile';

@InputType()
export class ProfileInput implements Partial<Profile> {
  @Field()
  username!: string;
}
