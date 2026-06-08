import express from "express";
import morgan from "morgan";

import router from "./routes.js";

import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { tenantMiddleware } from "./middlewares/tenant.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";

export function createExpressServer(_db: any) {
  const app = express();

  app.use(morgan("dev"));
  app.use(corsMiddleware);
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      message: "Apollonia Employee Management API running",
      database: "PostgreSQL",
      orm: "Prisma",
      module: "esm",
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      database: "postgres",
      orm: "prisma",
      module: "esm",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", tenantMiddleware, router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
