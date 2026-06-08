import { Request, Response, NextFunction } from "express";

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-tenant-id",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
};
