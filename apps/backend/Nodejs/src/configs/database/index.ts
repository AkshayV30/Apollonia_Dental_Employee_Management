import { CONFIG } from "../env.js";
import { connectPostgres } from "./prisma.js";

export async function initializeDatabase() {
  switch (CONFIG.DB_MODE) {
    case "postgres":
      await connectPostgres();
      return { mode: "postgres" };

    default:
      throw new Error(`Unsupported DATABASE_MODE: ${CONFIG.DB_MODE}`);
  }
}
