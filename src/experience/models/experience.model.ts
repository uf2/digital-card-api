import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExperiencePeriod } from './experience-period.model.js';

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  location: string;

  @Field(() => String, { nullable: true })
  summary: string | null;

  @Field(() => ExperiencePeriod)
  period: ExperiencePeriod;
}
