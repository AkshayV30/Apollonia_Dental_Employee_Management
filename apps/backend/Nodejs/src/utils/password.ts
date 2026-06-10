import bcrypt from "bcryptjs";

import { CONFIG } from "../configs/env.js";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, CONFIG.PASSWORD_SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
