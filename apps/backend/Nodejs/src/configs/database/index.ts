import { CONFIG } from "../env";
import { connectMongo } from "./mongo";
import { loadLocalJson } from "./local";

export async function initializeDatabase() {
  switch (CONFIG.DB_MODE) {
    case "local-json":
      return {
        mode: "local-json",
        employees: loadLocalJson("sampleData.json"),
      };

    case "local-mongo":
      await connectMongo();
      return { mode: "local-mongo" };
    case "cloud-atlas-mongo":
      await connectMongo();
      return { mode: "cloud-atlas-mongo" };

    default:
      throw new Error(`Unsupported DATABASE_MODE: ${CONFIG.DB_MODE}`);
  }
}
