import mongoose from "mongoose";
import chalk from "chalk";
import { CONFIG } from "../env";

/**
 * connectMongo()
 * ---------------
 * Establishes MongoDB connection and reports DB readiness.
 *
 * Behavior:
 * - Connects to MongoDB (local or cloud)
 * - Detects whether database already exists
 * - Does NOT recreate DB if it exists
 * - Logs READY state clearly
 *
 * MongoDB note:
 * - MongoDB creates databases lazily (on first write)
 * - We only detect existence, never force creation
 */
export async function connectMongo(): Promise<typeof mongoose> {
  const mongoURI =
    CONFIG.DB_MODE === "local-mongo" ? CONFIG.MONGO_LOCAL : CONFIG.MONGO_ATLAS;

  if (!mongoURI) {
    throw new Error(" MongoDB URI missing in environment variables");
  }

  try {
    console.log(chalk.cyanBright("\n🔌 Connecting to MongoDB..."));
    console.log(chalk.gray(` Mode: ${CONFIG.DB_MODE}`));

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });

    const connection = mongoose.connection;
    const { name, host, port } = connection;

    console.log(
      chalk.greenBright(` MongoDB connection established → ${host}:${port}`),
    );

    /**
     * Check database existence
     * ------------------------
     * MongoDB only creates DB on first write.
     * We inspect existing databases via admin API.
     */
    const admin = connection.db.admin();
    const { databases } = await admin.listDatabases();
    const dbExists = databases.some((db) => db.name === name);

    if (dbExists) {
      console.log(chalk.blueBright(` Database "${name}" already exists`));
    } else {
      console.log(chalk.yellowBright(` Database "${name}" does not exist yet`));
      console.log(
        chalk.greenBright(
          `MongoDB will create "${name}" automatically on first write`,
        ),
      );
    }

    /**
     * Runtime error listener
     */
    connection.on("error", (err) => {
      console.error(chalk.redBright(" MongoDB runtime error:"), err.message);
    });

    console.log(
      chalk.greenBright(` DATABASE READY → ${name} (${CONFIG.DB_MODE})\n`),
    );

    return mongoose;
  } catch (err: any) {
    console.error(
      chalk.redBright("MongoDB initialization failed:"),
      err.message,
    );
    throw err;
  }
}
