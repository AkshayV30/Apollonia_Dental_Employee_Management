import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT,
  DB_MODE: process.env.DATABASE_MODE,
  MONGO_LOCAL: process.env.MONGO_URI_LOCAL,
  MONGO_ATLAS: process.env.MONGO_URI_ATLAS,
  JWT_SECRET: process.env.JWT_SECRET,
};
