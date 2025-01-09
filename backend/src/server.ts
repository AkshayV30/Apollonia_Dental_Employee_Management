import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database/database";
import { employeeRouter } from "./routes/routes";

// Load environment variables from the .env file,
dotenv.config();

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

const uri = "mongodb://localhost:27017/AlponiaDental_DB";

connectToDatabase(uri)
  .then(() => {
    const app = express();

    //Enable CORS Middleware
    app.use(cors());
    // Middleware to parse JSON
    app.use(express.json());

    app.use("/employees", employeeRouter);

    // start the Express server
    const PORT = process.env.PORT || 5200;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost : ${PORT} ...`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
