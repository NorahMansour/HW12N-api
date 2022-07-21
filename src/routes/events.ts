import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { upsertEventsController } from "../controllers/upsert-event";
import _ from "lodash";
import { prismaClient } from "../prisma";
import { ObjectId } from "bson";
import Fuse from "fuse.js";
import { addAuthorization } from "../hooks/auth";
import { Event } from "@prisma/client";

//const querystring = require ('querystring')
const Event = Type.Object({
  event_id: Type.String(),
  name: Type.String(),
  deta: Type.String(),
  Start_endTime: Type.String(),
  location: Type.String(),
  description: Type.String(),
  tickets_count: Type.String(),
});

//type Event = Static<typeof Event>; //type
const EventWithoutId = Type.Object({
  name: Type.String(),
  deta: Type.String(),
  Start_endTime: Type.String(),
  location: Type.String(),
  description: Type.String(),
  tickets_count: Type.String(),
});
type EventWithoutId = Static<typeof EventWithoutId>;
const PartialEventstWithoutId = Type.Partial(EventWithoutId);
type PartialEventstWithoutId = Static<typeof PartialEventstWithoutId>;

const GetEventsQuery = Type.Object({
  name: Type.Optional(Type.String()),
});

type GetEventsQuery = Static<typeof GetEventsQuery>;
const EventParams = Type.Object({
  event_id: Type.String(),
});

type EventParams = Static<typeof EventParams>; //typebox
type EventType = Static<typeof Event>; //typebox
export let events: Event[];
export default async function (server: FastifyInstance) {
  server.route({
    method: "POST",
    url: "/events",
    schema: {
      summary: "Creates new event + all properties are required",
      tags: ["Events"],
      body: EventWithoutId,
    },
    handler: async (request, reply) => {
      const event = request.body as any;
      return await prismaClient.event.create({
        data: event,
      });
    },
  });
  //****************************************** PUT
  server.route({
    method: "PUT",
    url: "/events",
    schema: {
      summary: "Creates new event + all properties are required",
      tags: ["Events"],
      body: EventWithoutId,
    },
    handler: async (request, reply) => {
      const event = request.body as EventWithoutId;
      //if (!ObjectId.isValid(event.event_id)) {
        // reply.badRequest("event_id should be an ObjectId! ");
      // } 
        return await prismaClient.event.create({
          //where: { event_id: event.event_id },
          data: event,
          //update: _.omit(event, ["event_id"]),
        });
      // }
    },
  });
  //*******************************update event
  server.route({
    method: "PATCH",
    url: "/events/:event_id", //'/events/:eventId
    schema: {
      summary: "Update a event by id + you dont need to pass all properties",
      tags: ["Events"],
      body: PartialEventstWithoutId, //EventWithoutId
      params: EventParams,
    },
    handler: async (request, reply) => {
      const { event_id } = request.params as EventParams;
      if (!ObjectId.isValid(event_id)) {
        reply.badRequest("event_id should be an objectId!");
        return;
      }
      const event = request.body as PartialEventstWithoutId;
      return prismaClient.event.update({
        where: { event_id },
        data: event,
      });
    },
  });
  //*****************************************delete events by id*********************
  server.route({
    method: "DELETE",
    url: "/events/:event_id",
    schema: {
      summary: "Deletes a events",
      tags: ["Events"],
      params: EventParams,
    },
    handler: async (request, reply) => {
      const { event_id } = request.params as EventParams;
      if (!ObjectId.isValid(event_id)) {
        reply.badRequest("event_id should be an objectId!");

        return;
      }
      return prismaClient.event.delete({
        where: { event_id },
      });
    },
  });
 
  
  //*************************** find events or all them by query *****************
  server.route({
    method: "GET",
    url: "/events",
    schema: {
      summary: "Gets all events",
      tags: ["Events"],
      querystring: GetEventsQuery, // get ,querystring
      response: {
        "2xx": Type.Array(Event),
      },
    },
    handler: async (request, reply) => {
      const query = request.query as GetEventsQuery;
      await prismaClient.event.findMany();
      const events = await prismaClient.event.findMany();

      if (!query.name) return events;

      const fuse = new Fuse(events, {
        includeScore: true,
        isCaseSensitive: false,
        includeMatches: true,
        findAllMatches: true,
        threshold: 0,
        keys: [
          "name",
          "deta",
          " Start_endTime",
          " location",
          "description",
          "tickets_count",
        ],
      });

      console.log(JSON.stringify(fuse.search(query.name)));

      const result: Event[] = fuse.search(query.name).map((r) => r.item);
      return result;
    },
  });
  
}
