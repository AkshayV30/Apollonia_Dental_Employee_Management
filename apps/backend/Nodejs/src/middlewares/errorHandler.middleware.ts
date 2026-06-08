import { Request, Response, NextFunction } from "express";

type ErrorHandlerFn = (err: any, res: Response) => Response | undefined;

const prismaErrorHandlers: Record<string, ErrorHandlerFn> = {
  P2002: (err, res) =>
    res.status(409).json({
      error: "Duplicate record",
      details: err?.meta,
    }),

  P2025: (err, res) =>
    res.status(404).json({
      error: "Record not found",
      details: err?.meta,
    }),
};

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("🔥 ERROR HANDLER CAUGHT:", {
    name: err?.name,
    code: err?.code,
    message: err?.message,
    stack: err?.stack,
  });

  const prismaHandler = prismaErrorHandlers[err?.code];

  if (prismaHandler) {
    return prismaHandler(err, res);
  }

  if (err?.message?.startsWith("Tenant not found")) {
    return res.status(404).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal Server Error",
  });
}
