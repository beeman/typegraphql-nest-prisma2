import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  PostCrudResolver,
  PostRelationsResolver,
  UserCrudResolver,
  UserRelationsResolver,
} from '@typegraphql-nest-prisma2/data';
import { TypeGraphQLModule } from 'typegraphql-nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { resolve } from 'path';

const prisma = new PrismaClient();
interface Context {
  prisma: PrismaClient;
}

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      path: '/',
      emitSchemaFile: resolve(__dirname, './generated-schema.graphql'),
      validate: false,
      context: (): Context => ({ prisma }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserRelationsResolver,
    UserCrudResolver,
    PostRelationsResolver,
    PostCrudResolver,
  ],
})
export class AppModule {}

//
//
// // custom resolver for custom business logic using Prisma Client
// @Resolver(of => User)
// class CustomUserResolver {
//   @Query(returns => User, { nullable: true })
//   async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
//     return await prisma.user.findOne({
//       where: { email: "bob@prisma.io" },
//     });
//   }
//
//   @FieldResolver(type => Post, { nullable: true })
//   async favoritePost(
//     @Root() user: User,
//     @Ctx() { prisma }: Context,
//   ): Promise<Post | undefined> {
//     const [favoritePost] = await prisma.user
//     .findOne({ where: { id: user.id } })
//     .posts({ first: 1 });
//
//     return favoritePost;
//   }
// }
