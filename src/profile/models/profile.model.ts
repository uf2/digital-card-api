import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Public profile of the engineer' })
export class Profile {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ description: 'One-line professional headline' })
  headline: string;

  @Field({ description: 'Short introduction' })
  description: string;

  @Field()
  location: string;
}
