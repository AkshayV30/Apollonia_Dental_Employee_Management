import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contracts/contract.d";
import contractJson from "./contracts/contract.json" with { type: "json" };

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

export const db = postgres<Contract>({
  contractJson,
  url: DATABASE_URL,
});
