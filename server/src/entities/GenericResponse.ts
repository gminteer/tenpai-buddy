import {Field, Int, ObjectType} from 'type-graphql';

@ObjectType({description: 'GenericResponse'})
export class GenericResponse {
  @Field()
  public ok!: boolean;
  @Field(() => Int, {nullable: true})
  public status?: number;
  @Field({nullable: true})
  public message?: string;
}
