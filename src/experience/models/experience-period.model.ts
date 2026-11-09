import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Employment period with month precision' })
export class ExperiencePeriod {
  @Field({ description: 'First month, YYYY-MM' })
  start: string;

  @Field(() => String, {
    nullable: true,
    description: 'Last month, YYYY-MM, null while the job is current',
  })
  end: string | null;

  @Field({ description: 'True while the job is current' })
  isCurrent: boolean;

  @Field({
    description: 'Human readable period, for example "Jun 2018 - Jul 2026"',
  })
  label: string;

  @Field(() => Int, {
    description: 'Length in calendar months, first and last month included',
  })
  durationMonths: number;
}
