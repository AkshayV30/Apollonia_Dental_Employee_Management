import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CONFIG } from "../env";

export const signup = async (_req: Request, res: Response) => {
  res.json({
    msg: "Signup placeholder. Add real user table later.",
  });
};

export const login = async (_req: Request, res: Response) => {
  const token = jwt.sign(
    {
      user: "demo",
      role: "ADMIN",
      tenant: "apollonia",
    },
    CONFIG.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({ token });
};

export const dashboard = (req: any, res: Response) => {
  res.json({
    msg: "Dashboard access granted",
    user: req.user,
  });
};
