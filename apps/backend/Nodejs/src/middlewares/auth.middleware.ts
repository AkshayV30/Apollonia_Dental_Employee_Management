import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../configs/env.js";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "No token provided",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Invalid token",
    });
  }
};

export default auth;
