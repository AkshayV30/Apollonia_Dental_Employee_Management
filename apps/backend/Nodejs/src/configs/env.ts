import dotenv from "dotenv";
dotenv.config();

function required(name: string, value?: string): string {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
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
} as const;
