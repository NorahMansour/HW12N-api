import { UserRole } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import Fuse from "fuse.js";
import _ from "lodash";
import fastifySensible from "@fastify/sensible";
import { prismaClient } from "../prisma";
import { upsertUserController } from "../controllers/upsert-user";
import { addAuthorization } from "../hooks/auth";

const User = Type.Object({
  //user_id: Type.String(),
  name: Type.String(),
  password: Type.String(),
  email: Type.String(),
  role: Type.String(),
  //ticketTicket_id: Type.String(),
});


type User = Static<typeof User>;
const GetUsersQuery = Type.Object({
  name: Type.Optional(Type.String()),
});

export default async function (server: FastifyInstance) {
  // Create user without the need for user_id
  addAuthorization(server);
  server.route({
    method: "POST",
    url: "/user",
    schema: {
      summary: "Creates new user",
      tags: ["User"],
      body: User,
    },
    handler: async (request, reply) => {
      const User = request.body as any;
      await prismaClient.user.create({
        data: User,
      });
      return prismaClient.user.findMany();
    },
  });
}

/*server.route({
    method: "POST",
    url: "/user",
    schema: {
      summary: "Creates new user",
      tags: ["User"],
      body: UserWithoutId,
    },
    handler: async (request, reply) => {
      const user = request.body as any ;
      return await prismaClient.user.create({
        data:user,
      });
    },
  });*/
///Upsert one but all fields are required//


/* server.route({
    method: "PATCH",
    url: "/user/:user_id",
    schema: {
      summary: "Update user by id + you dont need to pass all properties",
      tags: ["User"],
      body: PartiaUserWithoutId,
      params: UserParams,
    },
    handler: async (request, reply) => {
      const { user_id } = request.params as UserParams;

      if (!ObjectId.isValid(user_id)) {
        return;
      }
      const user = request.body as PartiaUserWithoutId;

      return prismaClient.user.update({
        where: { user_id },
        data: user,
      });
    },
  });*/

/*server.route({
    method: "DELETE",
    url: "/users/:id",
    schema: {
      summary: "Deletes a user by id ",
      tags: ["User"],
      params: Type.Object({
        id:Type.String(),
      })//UserParams,
    },
    handler: async (request, reply) => {
      const { id } :any = request.params;
      await prismaClient.user.delete({
        where: {user_id:id},
        
      });
      return prismaClient.user.findMany()
    },
  });*/
//}
