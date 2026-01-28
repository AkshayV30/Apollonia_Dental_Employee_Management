import chalk from "chalk";
import { CONFIG } from "./configs/env";
import { createExpressServer } from "./app";
import { initializeDatabase } from "./configs/database";

const SERVER_URL =
  CONFIG.PUBLIC_URL ?? `${CONFIG.PROTOCOL}://${CONFIG.HOST}:${CONFIG.PORT}`;

async function startServer() {
  try {
    const db = await initializeDatabase();
    const app = createExpressServer(db);

    app.listen(CONFIG.PORT, CONFIG.HOST, () => {
      console.log(` Server running → ${chalk.cyan(SERVER_URL)}`);
      console.log(` Environment → ${chalk.yellow(CONFIG.NODE_ENV)}`);
      console.log(` DB Mode → ${chalk.green(db.mode)}`);
    });
  } catch (err: any) {
    console.error(chalk.red("Startup failed:"), err.message);
    process.exit(1);
  }
}

startServer();
