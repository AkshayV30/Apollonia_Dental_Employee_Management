import jwt, { SignOptions } from "jsonwebtoken";

import { CONFIG } from "../configs/env.js";
import { AuthUser } from "../types/auth.js";

export function signAccessToken(user: AuthUser): string {
  const payload: AuthUser = {
    id: user.id,
    tenantId: user.tenantId,
    tenantSlug: user.tenantSlug,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: CONFIG.JWT_ACCESS_EXPIRES_IN,
  };

  return jwt.sign(payload, CONFIG.JWT_SECRET, options);
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, CONFIG.JWT_SECRET) as AuthUser;
}
