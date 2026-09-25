import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { Request, Response, NextFunction } from "express";

type PrismaErrorHandlerFn = (
  err: PrismaClientKnownRequestError,
  res: Response,
) => Response;

const prismaErrorHandlers: Record<string, PrismaErrorHandlerFn> = {
  P2002: (err, res) =>
    res.status(409).json({
      error: "Duplicate record",
      details: err.meta,
    }),

  P2025: (err, res) =>
    res.status(404).json({
      error: "Record not found",
      details: err.meta,
    }),
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let errorName = "UnknownError";
  let errorMessage = "An unhandled exception occurred.";
  let errorStack: string | undefined = undefined;
  let errorCode: string | undefined = undefined;

  if (err instanceof Error) {
    errorName = err.name;
    errorMessage = err.message;
    errorStack = err.stack;

    // FIX 2: Check standard index fields using unknown double-casting to bypass index-signature strictness
    const recordErr = err as unknown as Record<string, unknown>;
    if ("code" in recordErr && typeof recordErr.code === "string") {
      errorCode = recordErr.code;
    }
  } else if (typeof err === "string") {
    errorMessage = err;
  }

  console.error("🔥 ERROR HANDLER CAUGHT:", {
    name: errorName,
    code: errorCode,
    message: errorMessage,
    stack: errorStack,
  });

  // FIX 3: Evaluate directly against the class constructor imported from the database adapter package
  if (err instanceof PrismaClientKnownRequestError) {
    const prismaHandler = prismaErrorHandlers[err.code];
    if (prismaHandler) {
      return prismaHandler(err, res);
    }
  }

  if (errorMessage.startsWith("Tenant not found")) {
    return res.status(404).json({
      error: errorMessage,
    });
  }

  return res.status(500).json({
    error: "Internal Server Error",
  });
}
