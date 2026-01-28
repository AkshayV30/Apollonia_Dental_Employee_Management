import express from "express";
import morgan from "morgan";
import router from "./routes";

import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";

export function createExpressServer(db: any) {
  const app = express();

  app.use(morgan("dev"));
  app.use(corsMiddleware);

  app.use(express.json());

  app.get("/", (_, res) => res.send("Node JS API Server running"));
  app.use("/api", router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
