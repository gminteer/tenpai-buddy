import {Field, Float, InputType, Int} from 'type-graphql';

import {Score} from '../../entities/Score';

@InputType()
export class ScoreInput implements Partial<Score> {
  @Field(() => Int)
  moveCount!: number;

  @Field(() => Float)
  efficiency!: number;

  @Field(() => Int)
  ukeire!: number;
}
