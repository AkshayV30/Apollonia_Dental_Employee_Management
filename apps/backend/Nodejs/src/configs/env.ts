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

  MONGO_LOCAL: process.env.MONGO_URI_LOCAL,
  MONGO_ATLAS: process.env.MONGO_URI_ATLAS,

  /* ----------------------------------
   * Security
   * ---------------------------------- */
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
} as const;
