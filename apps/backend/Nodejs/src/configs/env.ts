import dotenv from "dotenv";
dotenv.config();

export type JwtExpiry =
  | `${number}ms`
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`
  | number;

function required(name: string, value?: string): string {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

function numberFromEnv(
  name: string,
  value: string | undefined,
  fallback: number,
) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`❌ Invalid number for environment variable: ${name}`);
  }

  return parsed;
}

function jwtExpiryFromEnv(
  value: string | undefined,
  fallback: JwtExpiry,
): JwtExpiry {
  if (!value) {
    return fallback;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  if (/^\d+(ms|s|m|h|d|w|y)$/.test(value)) {
    return value as JwtExpiry;
  }

  throw new Error(
    "❌ Invalid JWT_ACCESS_EXPIRES_IN. Use values like 15m, 1h, 7d, or 3600",
  );
}

export const CONFIG = {
  /* ----------------------------------
   * Runtime
   * ---------------------------------- */
  NODE_ENV: process.env.NODE_ENV ?? "development",

  /* ----------------------------------
   * Server
   * ---------------------------------- */
  PROTOCOL: process.env.PROTOCOL ?? "http",
  HOST: process.env.HOST ?? "0.0.0.0",
  PORT: Number(process.env.PORT ?? 5000),

  PUBLIC_URL: process.env.PUBLIC_URL,

  /* ----------------------------------
   * Database
   * ---------------------------------- */
  DB_MODE: process.env.DATABASE_MODE,
  DATABASE_URL: required("DATABASE_URL", process.env.DATABASE_URL),

  /* ----------------------------------
   * Security
   * ---------------------------------- */
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),

  JWT_ACCESS_EXPIRES_IN: jwtExpiryFromEnv(
    process.env.JWT_ACCESS_EXPIRES_IN,
    "1h",
  ),

  PASSWORD_SALT_ROUNDS: numberFromEnv(
    "PASSWORD_SALT_ROUNDS",
    process.env.PASSWORD_SALT_ROUNDS,
    12,
  ),
} as const;
