import { PrismaClient } from '@prisma/client'
export const prismaClient = new PrismaClient()



// Connect the client
export async function connectDb() {
	await prismaClient.$connect();
} 