import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/token.js";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "No token provided",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    (req as any).user = decoded;
    (req as any).tenantSlug = decoded.tenantSlug;

    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Invalid or expired token",
    });
  }
};

export default auth;
