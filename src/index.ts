//import test from 'node:test';
import { connectDb,prismaClient } from "./prisma";
import { listen } from "./server";




  async function start() {
    await connectDb();
    listen();
    //test();
  }
  start();

/*async function test() {
  await prismaClient.event.create({
    data: {
      name: "BLUV",
      deta: "23JAN-29JAN",
      Start_endTime: "4AM - 10PM",
      location: "Ryiadh",
      description: "fanny time",
      tickets_count: "200",
    },
  });
}*/

//test();
