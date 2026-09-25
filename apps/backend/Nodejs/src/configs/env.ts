import "dotenv/config";

export type JwtExpiry =
  | `${number}ms`
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`
  | number;

/* ----------------------------------
 * Helpers & Validators
 * ---------------------------------- */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

function integerFromEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      `❌ Environment variable ${name} must be a positive integer`,
    );
  }
  return parsed;
}

function jwtExpiryFromEnv(fallback: JwtExpiry): JwtExpiry {
  const value = process.env.JWT_ACCESS_EXPIRES_IN;
  if (!value) return fallback;

  if (/^\d+\$/.test(value)) return Number(value);
  if (/^\d+(ms|s|m|h|d|w|y)\$/.test(value)) return value as JwtExpiry;

  throw new Error(
    "❌ Invalid JWT_ACCESS_EXPIRES_IN. Use values like 15m, 1h, 7d, or 3600",
  );
}

/* ----------------------------------
 * Unified Configuration
 * ---------------------------------- */

export const CONFIG = Object.freeze({
  /* Runtime */
  NODE_ENV: process.env.NODE_ENV ?? "development",

  /* Server */
  PROTOCOL: process.env.PROTOCOL ?? "http",
  HOST: process.env.HOST ?? "0.0.0.0",
  PORT: integerFromEnv("PORT", 5000),
  PUBLIC_URL: process.env.PUBLIC_URL,

  /* Database */
  DB_MODE: process.env.DATABASE_MODE,
  DATABASE_URL: required("DATABASE_URL"),

  /* Security */
  JWT_SECRET: required("JWT_SECRET"),
  JWT_ACCESS_EXPIRES_IN: jwtExpiryFromEnv("1h"),
  PASSWORD_SALT_ROUNDS: integerFromEnv("PASSWORD_SALT_ROUNDS", 12),
});
