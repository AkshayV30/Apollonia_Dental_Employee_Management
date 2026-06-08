import express from "express";
import morgan from "morgan";

import router from "./routes";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { tenantMiddleware } from "./middlewares/tenant.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";

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
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      database: "postgres",
      orm: "prisma",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", tenantMiddleware, router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
