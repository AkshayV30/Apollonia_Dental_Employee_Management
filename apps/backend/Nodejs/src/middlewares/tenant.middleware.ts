import { Request, Response, NextFunction } from "express";

export function tenantMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const tenantSlug = req.header("x-tenant-id") || "apollonia";

  (req as any).tenantSlug = tenantSlug;

  next();
}
