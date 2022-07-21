import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { upserTicketController } from "../controllers/upsert-ticket";
import { prismaClient } from "../prisma";
import { Ticket } from "@prisma/client";
import { ObjectId } from "bson";
import Fuse from 'fuse.js';

const Ticket = Type.Object({
  //id: Type.String(),
  name: Type.String(),
  date: Type.String(),
});

const TicketWithoutId = Type.Object({
  name: Type.String(),
  date: Type.String(),
});

type TicketWithoutId = Static<typeof TicketWithoutId>;

const PartialTicketWithoutId = Type.Partial(TicketWithoutId);
type PartialTicketWithoutId = Static<typeof PartialTicketWithoutId>;

const GetTicketQuery = Type.Object({
  name: Type.Optional(Type.String()),
});

type GetTicketQuery = Static<typeof GetTicketQuery>;

const TicketParams = Type.Object({
  ticket_id: Type.String(),
});
type TicketParams = Static<typeof TicketParams>;
type TicketType = Static<typeof Ticket>; //typebox

export let ticket: Ticket[] = [];

export default async function (server: FastifyInstance) {
  server.route({
    method: "POST",
    url: "/ticket",
    schema: {
      summary: "Creates new ticket + all properties are required",
      tags: ["ticket"],
      body: TicketWithoutId,
    },
    handler: async (request, reply) => {
      const ticket: any = request.body as TicketWithoutId;
      return await prismaClient.ticket.create({
        data: ticket,
      });
    },
  });

  server.route({
    method: "PATCH",
    url: "/ticket/:ticket_id",
    schema: {
      summary: "Update a ticket by id + you dont need to pass all properties",
      tags: ["ticket"],
      body: PartialTicketWithoutId,
      params: TicketParams,
    },
    handler: async (request, reply) => {
      const { ticket_id }: any = request.params as TicketParams;
      if (!ObjectId.isValid(ticket_id)) {
        reply.badRequest("ticket_id should be an ObjectId!");
        return;
      }
      const ticket = request.body as PartialTicketWithoutId;

      return prismaClient.ticket.update({
        where: { ticket_id },
        data: ticket,
      });
    },
  });
//delete one by id 
  server.route({
    method: "DELETE",
    url: "/ticket/:ticket_id",
    schema: {
      summary: "Deletes a ticket",
      tags: ["ticket"],
      params:TicketParams,
      },
    handler: async (request, reply) => {
      const {ticket_id} = request.params as  TicketParams;
      if (!ObjectId.isValid(ticket_id)) {
				reply.badRequest('ticket_id should be an ObjectId!');
				return;
    }
    return prismaClient.ticket.delete({
      where:{ticket_id},
    });
  },
})
}
