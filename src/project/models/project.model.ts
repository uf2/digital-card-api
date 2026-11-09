import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, {
    nullable: true,
    description:
      'Public page of the project, or the company site for a private project',
  })
  url: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Public source code, null for private projects',
  })
  repositoryUrl: string | null;

  @Field({ description: 'Closed company project without public source code' })
  isPrivate: boolean;

  @Field(() => [String])
  technologies: string[];
}
