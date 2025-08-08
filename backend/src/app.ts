import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import morgan from "morgan";

import { routes } from "./routes/routes";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";

dotenv.config();

// Read DB mode from environment variables
const mode = process.env.DATABASE_MODE;

const app = express();

// Middleware: Enable CORS and parse JSON bodies
app.use(corsMiddleware);
app.use(express.json());

app.use(morgan("dev")); // logs requests in dev-friendly format

// Use local JSON data or connect to MongoDB based on mode
if (mode === "local-json") {
  console.log(" Using local JSON data source");

  // Load JSON data file with sample employee data
  const dataPath = path.join(__dirname, "database", "sampleData.json");
  const employees = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // API endpoint serving employee data from JSON
  app.get("/api/employees", (req, res) => {
    res.json(employees);
  });
} else if (mode === "local-mongo" || mode === "cloud-mongo") {
  // Pick MongoDB URI based on local or cloud mode
  const mongoUri =
    mode === "local-mongo"
      ? process.env.MONGO_URI_LOCAL
      : process.env.MONGO_URI_ATLAS;

  // Throw error if URI missing
  if (!mongoUri) throw new Error(` Mongo URI not set for ${mode}`);

  // Connect to MongoDB using Mongoose
  mongoose
    .connect(mongoUri)
    .then(() => console.log(`MongoDB Connected (${mode})`))
    .catch((err) => console.error(err));

  // Looping through all routes
  routes.forEach(({ path, route }) => {
    app.use(path, route);
  });
}

// Root route to show server status in a simple HTML page
app.get("/", (req, res) => {
  const port = process.env.PORT || 5000;
  res.send(`
    <html>
      <head><title>Server Status</title></head>
      <body style="font-family: Arial; text-align: center; margin-top: 50px;">
        <h1>Server is running on port ${port}</h1>
      </body>
    </html>
  `);
});

// Global error handling middleware (handles any thrown errors)
app.use(errorHandler);

// 404 handler (for any unmatched routes)
app.use(notFoundHandler);

export default app;
