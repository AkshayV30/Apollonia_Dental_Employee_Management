import mongoose from 'mongoose';
import { CONFIG } from '../env';

export async function connectMongo() {
  const uri = CONFIG.DB_MODE === 'local-mongo' ? CONFIG.MONGO_LOCAL : CONFIG.MONGO_ATLAS;

  if (!uri) throw new Error('Mongo URI missing');

  await mongoose.connect(uri);

  console.log(`MongoDB Connected (${CONFIG.DB_MODE})`);
}

import mongoose from 'mongoose';
import chalk from 'chalk';

/**
 * connectDB()
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
export const connectDB = async (mongoURI) => {
  try {
    console.log(chalk.cyanBright('\n🔍 Checking MongoDB connection...'));
    console.log(chalk.gray(`➡️ Connection URI: ${mongoURI}`));

    /**
     * mongoose.connect()
     * -------------------
     * Attempts to connect to MongoDB using the URI.
     * serverSelectionTimeoutMS:
     *   - Limits how long Mongoose waits before failing if the database
     *     server is unreachable.
     *   - Helps avoid long hangs during container startup or incorrect URIs.
     */
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 8000 });

    // Get the active connection instance
    const connection = mongoose.connection;

    /**
     * connection.once('open')
     * ------------------------
     * Triggered only once when the connection is successfully opened.
     *
     * Ideal place for:
     * - Logging database metadata
     * - Running health checks
     * - Checking existence of the database
     */
    connection.once('open', async () => {
      console.log(chalk.greenBright('✅ MongoDB connection established successfully.'));
      console.log(chalk.gray(`📦 Connected Database: ${connection.name}`));

      /**
       * Checking if database exists
       * ----------------------------
       * MongoDB physically creates a database only after writing data to it.
       * Using admin.listDatabases() tells us which DBs already exist.
       */
      const admin = connection.db.admin();
      const { databases } = await admin.listDatabases();

      const dbExists = databases.some((db) => db.name === connection.name);

      if (dbExists) {
        console.log(chalk.blueBright(`🗂️ Database "${connection.name}" already exists.`));
      } else {
        console.log(chalk.yellowBright(`⚙️ Database "${connection.name}" does not exist yet.`));
        console.log(
          chalk.greenBright(
            `🚀 MongoDB will automatically create "${connection.name}" on the first write.`
          )
        );
      }

      console.log(
        chalk.green(
          `🚀 Ready! Connected to "${connection.name}" at ${connection.host}:${connection.port}\n`
        )
      );
    });

    /**
     * connection.on('error')
     * -----------------------
     * Captures runtime connection errors such as:
     * - Network disconnects
     * - Authentication failures
     * - MongoDB server crashes
     */
    connection.on('error', (err) => {
      console.error(chalk.redBright('❌ MongoDB runtime connection error:'), err.message);
    });

    /**
     * Return the connection so that server.js can:
     * - Log connection info
     * - Confirm DB readiness before starting Express server
     */
    return connection;
  } catch (err) {
    /**
     * Catch block:
     * -------------
     * Handles any errors thrown during the initial `mongoose.connect()` call.
     *
     * Examples:
     * - Invalid URI format
     * - MongoDB server not running
     * - Authentication failures
     */
    console.error(chalk.redBright('❌ Initial MongoDB connection failed:'), err.message);

    // Rethrow error so the server startup can fail safely
    throw err;
  }
};

export default connectDB;
