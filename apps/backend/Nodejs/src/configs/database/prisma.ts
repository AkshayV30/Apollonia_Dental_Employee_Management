import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { CONFIG } from "../env.js";

const adapter = new PrismaPg({
  connectionString: CONFIG.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});

export async function connectPostgres() {
  await prisma.$connect();

  console.log("✅ PostgreSQL connected through Prisma");

  return prisma;
}

export async function disconnectPostgres() {
  await prisma.$disconnect();
}
