import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["DATABASE_URI", "PORT"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`${key} is missing in .env`);
    process.exit(1);
  }
}

export const config = {
  DATABASE_URI: process.env.DATABASE_URI!,
  PORT: parseInt(process.env.PORT!, 10) || 5200,
};
