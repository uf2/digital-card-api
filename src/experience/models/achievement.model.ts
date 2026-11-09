import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Achievement {
  @Field(() => ID)
  id: number;

  @Field()
  text: string;
}
