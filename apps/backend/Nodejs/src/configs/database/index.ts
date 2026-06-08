import { CONFIG } from "../env";
import { connectPostgres } from "./prisma";

export async function initializeDatabase() {
  switch (CONFIG.DB_MODE) {
    case "postgres":
      await connectPostgres();
      return { mode: "postgres" };

    default:
      throw new Error(`Unsupported DATABASE_MODE: ${CONFIG.DB_MODE}`);
  }
}
