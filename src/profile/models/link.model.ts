import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '../../generated/prisma/enums.js';

registerEnumType(LinkKind, { name: 'LinkKind' });

@ObjectType({ description: 'Link to a professional resource' })
export class Link {
  @Field(() => ID)
  id: number;

  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  label: string;

  @Field()
  url: string;
}
