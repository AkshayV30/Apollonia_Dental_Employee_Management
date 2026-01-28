import mongoose from "mongoose";
import chalk from "chalk";
import { CONFIG } from "../env";

/**
 * connectMongo()
 * ============================================================================
 * PURPOSE
 * ----------------------------------------------------------------------------
 * This function is the **single source of truth** for MongoDB initialization.
 * It is responsible for:
 *
 * 1. Establishing a connection to MongoDB using Mongoose
 * 2. Reporting the connection lifecycle (readyState transitions)
 * 3. Observing whether the target database already exists
 * 4. Logging a clear "DATABASE READY" signal for the rest of the application
 *
 * IMPORTANT DESIGN PRINCIPLES
 * ----------------------------------------------------------------------------
 * - This function NEVER creates databases explicitly.
 * - MongoDB creates databases lazily on the **first write operation**.
 * - We only OBSERVE database existence for logging & diagnostics.
 * - Works identically for:
 *     - Local MongoDB
 *     - MongoDB Atlas
 *     - Dockerized MongoDB
 *     - Kubernetes-deployed MongoDB
 *
 * RETURN VALUE
 * ----------------------------------------------------------------------------
 * Returns the active `mongoose` instance so:
 * - Models can be registered safely
 * - Health checks can inspect connection state
 */
export async function connectMongo(): Promise<typeof mongoose> {
  /**
   * STEP 1: Resolve the correct MongoDB URI
   * --------------------------------------------------------------------------
   * We choose the connection string based on DB_MODE.
   * This keeps application logic environment-agnostic.
   */
  const mongoURI =
    CONFIG.DB_MODE === "local-mongo" ? CONFIG.MONGO_LOCAL : CONFIG.MONGO_ATLAS;

  /**
   * Defensive check:
   * If the URI is missing, we fail FAST.
   * This avoids silent misconfiguration in prod.
   */
  if (!mongoURI) {
    throw new Error("MongoDB URI missing in environment variables");
  }

  /**
   * STEP 2: Log initial connection context
   * --------------------------------------------------------------------------
   * `mongoose.connection.readyState` at this point is ALWAYS 0 (DISCONNECTED).
   *
   * readyState values:
   * 0 → disconnected
   * 1 → connected
   * 2 → connecting
   * 3 → disconnecting
   */
  console.log(chalk.cyanBright("\n🔌 MongoDB Initialization"));
  console.log(chalk.gray(` Mode         : ${CONFIG.DB_MODE}`));
  console.log(
    chalk.gray(
      ` Initial state: ${mongoose.connection.readyState} (DISCONNECTED)`,
    ),
  );

  try {
    /**
     * STEP 3: Initiate connection
     * ------------------------------------------------------------------------
     * `mongoose.connect()`:
     * - Opens a connection pool
     * - Negotiates authentication
     * - Does NOT verify database existence
     */
    console.log(chalk.cyan(" Connecting..."));

    await mongoose.connect(mongoURI, {
      // Prevents hanging forever if MongoDB is unreachable
      serverSelectionTimeoutMS: 8000,
    });

    /**
     * STEP 4: Access the active connection object
     * ------------------------------------------------------------------------
     * After successful connection, `mongoose.connection` is hydrated.
     */
    const connection = mongoose.connection;

    console.log(
      chalk.greenBright(` Connected (readyState=${connection.readyState})`),
    );

    /**
     * Safety guard:
     * In extremely rare edge cases, connection may exist
     * but database handle (`connection.db`) is undefined.
     */
    if (!connection.db) {
      throw new Error("MongoDB connected but DB handle not initialized");
    }

    /**
     * STEP 5: Extract connection metadata
     * ------------------------------------------------------------------------
     * - `name` → database name resolved from URI
     * - `host` → MongoDB host
     * - `port` → undefined for Atlas SRV (expected)
     */
    const { name, host, port } = connection;

    console.log(chalk.green(` Host         : ${host}:${port ?? "atlas"}`));
    console.log(chalk.green(` Database     : ${name}`));

    /**
     * STEP 6: Database existence observation (READ-ONLY)
     * ------------------------------------------------------------------------
     * MongoDB databases are NOT created on connect.
     * They appear only after the first write.
     *
     * We use the admin API purely for visibility/logging.
     */
    const admin = connection.db.admin();
    const { databases } = await admin.listDatabases();

    const dbExists = databases.some((db) => db.name === name);

    if (dbExists) {
      console.log(chalk.blueBright(" Database state: EXISTS"));
    } else {
      console.log(chalk.yellowBright(" Database state: NOT CREATED YET"));
      console.log(
        chalk.gray(" MongoDB will create it automatically on first write"),
      );
    }

    /**
     * STEP 7: Runtime lifecycle listeners
     * ------------------------------------------------------------------------
     * These listeners provide observability during:
     * - Network drops
     * - Atlas maintenance
     * - Pod restarts (Kubernetes)
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

    /**
     * STEP 8: Final READY signal
     * ------------------------------------------------------------------------
     * This log is the contract:
     * - Other services may safely start
     * - Models can be registered
     * - API can accept traffic
     */
    console.log(
      chalk.greenBright(
        ` DATABASE READY (readyState=${connection.readyState})\n`,
      ),
    );

    return mongoose;
  } catch (err: any) {
    /**
     * STEP 9: Failure handling
     * ------------------------------------------------------------------------
     * We log the failure WITH readyState to help diagnose:
     * - Auth errors
     * - Network issues
     * - DNS / Atlas SRV failures
     */
    console.error(
      chalk.redBright(
        ` MongoDB FAILED (readyState=${mongoose.connection.readyState})`,
      ),
      err.message,
    );

    // Bubble up so application startup can fail safely
    throw err;
  }
}
