import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("🔥 ERROR HANDLER CAUGHT:");
  console.error(err);
  console.error("Name:", err?.name);
  console.error("Message:", err?.message);
  console.error("Stack:", err?.stack);

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors,
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate key",
      details: err.keyValue,
    });
  }

  // Default fallback
  res.status(500).json({
    error: "Internal Server Error",
  });
}
