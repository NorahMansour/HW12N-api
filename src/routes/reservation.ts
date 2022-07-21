import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { prismaClient } from "../prisma";
import { ObjectId } from "bson";

const Reservation = Type.Object({
  //json schema
  reservation_id: Type.String(),
  event_name:Type.String(),
  date: Type.String({format:'date-time'}),
  total:Type.String(),
  tickets_id : Type.String(),
  //paymentAmount: Type.String(),
});
const resWithoutId = Type.Object({
  //json schema
  //reservation_id : Type.String(),
  event_name:Type.String(),
  date: Type.String(({format:'date-time'})),
  total:Type.String(),
  //paymentAmount: Type.String(),
});
export type Reservation = Static<typeof Reservation>;
export default async function (server: FastifyInstance) {
  server.route({
    method: "POST",
    url: "/create/reservation",
    schema: {
      summary: "user make a reservation",
      tags: ["Reservation"],
      body: Type.Optional(resWithoutId),//Reservation, ///Type.Partial(resWithoutId)
    },
    handler: async (request, reply) => {
      const makeNewRes = request.body as any;
      return await prismaClient.reservation.create({
        data: {...makeNewRes},//makeNewRes,
      }); 
    },
  });
  server.route({
    method: "GET",
    url: "/view",
    schema: {
      summary: "view all reservation",
      tags: ["Reservation"],  
    },
    handler: async (request, reply) => {
        return await prismaClient.reservation.findMany();} 
  });
}
