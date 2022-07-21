import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { paymentController } from "../controllers/paymen";
import { Payment } from "@prisma/client";
import { prismaClient } from "../prisma";
import { ObjectId } from "bson";
import Fuse from "fuse.js";

const Payment = Type.Object({
  //id: Type.String(),
  paymentDate: Type.String({ format: "date-time" }),
  paymentAmount: Type.String(),
  payers_id: Type.String(),
  //user_id: Type.String(),
  //paymentType:Type.Enum(),
});

const PaymentWithoutId = Type.Object({
  paymentDate: Type.String(Date),
  paymentAmount: Type.Number(),
});

type PaymentWithoutId = Static<typeof PaymentWithoutId>;
const PartialPaymenttWithoutId = Type.Partial(PaymentWithoutId);
type PartialPaymenttWithoutId = Static<typeof PartialPaymenttWithoutId>;

const PaymentParams = Type.Object({
  payment_id: Type.String(),
});

type PaymentParams = Static<typeof PaymentParams>;
type PaymentType = Static<typeof Payment>;

export let payments: Payment[];

export default async function (server: FastifyInstance) {
  server.route({
    method: "POST",
    url: "/payment",
    schema: {
      summary: "Creates new payment + all properties are required",
      tags: ["payment"],
      body: Payment,
    },
    handler: async (request, reply) => {
      const payment: any = request.body as Payment;

      return await prismaClient.payment.create({
        data: {
          paymentDate: payment.paymentDate,
          paymentAmount: payment.paymentAmount,
          user: {
            connect: { user_id: payment.payers_id },
          },
        },
      });},});

  server.route({
    method: "GET",
    url: "/payment",
    schema: {
      summary: "view all payment",
      tags: ["payment"],
    },
    handler: async (request, reply) => {
      return await prismaClient.payment.findMany();
    },
  });
}
