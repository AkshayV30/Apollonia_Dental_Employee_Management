import mongoose from "mongoose";
import chalk from "chalk";
import { CONFIG } from "../env";

/**
 * connectMongo()
 * ---------------
 * Establishes MongoDB connection and reports readiness.
 *
 * Reports:
 * - Connection mode (local / atlas)
 * - readyState transitions
 * - Database existence (observational only)
 *
 * MongoDB behavior:
 * - Database is created lazily on first write
 * - No explicit DB creation is performed
 */
export async function connectMongo(): Promise<typeof mongoose> {
  const mongoURI =
    CONFIG.DB_MODE === "local-mongo" ? CONFIG.MONGO_LOCAL : CONFIG.MONGO_ATLAS;

  if (!mongoURI) {
    throw new Error("MongoDB URI missing in environment variables");
  }

  console.log(chalk.cyanBright("\n🔌 MongoDB Initialization"));
  console.log(chalk.gray(` Mode  : ${CONFIG.DB_MODE}`));
  console.log(
    chalk.gray(
      ` Initial state: ${mongoose.connection.readyState} (DISCONNECTED)`,
    ),
  );

  try {
    console.log(chalk.cyan(" Connecting..."));

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });

    const connection = mongoose.connection;

    console.log(
      chalk.greenBright(` Connected (readyState=${connection.readyState})`),
    );

    if (!connection.db) {
      throw new Error("MongoDB connected but DB handle not initialized");
    }

    const { name, host, port } = connection;

    console.log(chalk.green(` Host        : ${host}:${port ?? "atlas"}`));
    console.log(chalk.green(` Database    : ${name}`));

    /**
     * Database existence check (logging only)
     */
    const admin = connection.db.admin();
    const { databases } = await admin.listDatabases();
    const dbExists = databases.some((db) => db.name === name);

    if (dbExists) {
      console.log(chalk.blueBright(` Database state: EXISTS`));
    } else {
      console.log(chalk.yellowBright(` Database state: NOT CREATED YET`));
      console.log(chalk.gray(" Will be created automatically on first write"));
    }

    /**
     * Runtime lifecycle listeners
     */
    connection.on("connecting", () => {
      console.log(chalk.cyan(" MongoDB state → CONNECTING"));
    });

    connection.on("connected", () => {
      console.log(
        chalk.green(
          ` MongoDB state → CONNECTED (readyState=${connection.readyState})`,
        ),
      );
    });

    connection.on("disconnected", () => {
      console.log(
        chalk.yellow(
          ` MongoDB state → DISCONNECTED (readyState=${connection.readyState})`,
        ),
      );
    });

    connection.on("error", (err) => {
      console.error(chalk.redBright(" MongoDB runtime error:"), err.message);
    });

    console.log(
      chalk.greenBright(
        ` DATABASE READY (readyState=${connection.readyState})\n`,
      ),
    );

    return mongoose;
  } catch (err: any) {
    console.error(
      chalk.redBright(
        ` MongoDB FAILED (readyState=${mongoose.connection.readyState})`,
      ),
      err.message,
    );
    throw err;
  }
}
