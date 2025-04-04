import express from "express";
import cors from "cors";

import { connectToDatabase } from "./database/database";
import { employeeRouter } from "./routes/employee.routes";
import { config } from "./config/config";

// import helmet from "helmet";
// import compression from "compression";
// import rateLimit from "express-rate-limit";
// import morgan from "morgan";

// const { DATABASE_MODE, MONGO_URI_LOCAL, MONGO_URI_ATLAS } = process.env;

// if (!MONGO_URI_LOCAL || !MONGO_URI_ATLAS) {
//   console.error(
//     "No MONGO_URI_LOCAL or MONGO_URI_ATLAS environment variable has been defined in config.env"
//   );
//   process.exit(1);
// }

// // Determine which URI to use based on the DATABASE_MODE variable
// const uri = DATABASE_MODE === "atlas" ? MONGO_URI_ATLAS : MONGO_URI_LOCAL;

// console.log(`Starting app in '${DATABASE_MODE || "local"}' mode...`);

async function startServer() {
  try {
    await connectToDatabase(config.DATABASE_URI);

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/", (_req, res) => {
      res.send(" Welcome to the Express Server!");
    });

    app.use("/v1/employees", employeeRouter);

    app.use((_req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    const server = app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Closing server...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received. Shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
