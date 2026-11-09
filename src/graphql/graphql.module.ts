import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { GraphQLContext, LoadersFactory } from './loaders.factory.js';
import { LoadersModule } from './loaders.module.js';

const exampleQuery = `query Profile {
  profile {
    name
    headline
    description
    links {
      kind
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      position
      period {
        label
      }
      achievements {
        text
      }
    }
    projects {
      name
      url
      repositoryUrl
      isPrivate
    }
  }
}
`;

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [LoadersModule],
      inject: [LoadersFactory],
      useFactory: (loaders: LoadersFactory) => ({
        autoSchemaFile: join(process.cwd(), 'schema.gql'),
        sortSchema: true,
        graphiql: false,
        introspection: true,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({ document: exampleQuery }),
        ],
        context: (): GraphQLContext => ({ loaders: loaders.create() }),
      }),
    }),
  ],
})
export class ApiGraphQLModule {}
