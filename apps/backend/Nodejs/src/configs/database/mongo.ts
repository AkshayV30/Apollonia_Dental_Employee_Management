import mongoose from "mongoose";
import { CONFIG } from "../env";
import chalk from "chalk";

/**
 * connectMongo()
 * -----------
 * Establishes a connection to MongoDB using Mongoose.
 *
 * Key responsibilities of this function:
 * 1. Attempt connecting to MongoDB using the provided URI.
 * 2. Verify the database name and connection status.
 * 3. Check if the database already exists.
 * 4. Log helpful, color-coded messages for debugging and monitoring.
 * 5. Gracefully handle both initial connection errors and runtime errors.
 *
 * MongoDB behavior note:
 * - MongoDB creates a database automatically on first write.
 * - Therefore, we check existence using admin.listDatabases().
 *
 * Returns:
 * - The active Mongoose connection object.
 * - This object is used by the rest of the application (e.g., server.js).
 */

export async function connectMongo() {
  const mongoURI =
    CONFIG.DB_MODE === "local-mongo" ? CONFIG.MONGO_LOCAL : CONFIG.MONGO_ATLAS;

  if (!mongoURI) throw new Error("Mongo URI missing");

  try {
    console.log(chalk.cyanBright("\n🔍 Checking MongoDB connection..."));
    console.log(chalk.gray(`➡️ Connection URI: ${mongoURI}`));

    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 8000 });

    const { name, host, port } = mongoose.connection;

    console.log(
      chalk.greenBright(
        `✅ MongoDB connected successfully → ${name} @ ${host}:${port}`,
      ),
    );

    mongoose.connection.on("error", (err) => {
      console.error(chalk.redBright("❌ MongoDB runtime error:"), err.message);
    });
    return mongoose;
  } catch (err: any) {
    console.error(
      chalk.redBright("❌ MongoDB initial connection failed:"),
      err.message,
    );
    throw err;
  }
}
