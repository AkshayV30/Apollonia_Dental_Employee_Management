import { CONFIG } from './configs/env';
import chalk from 'chalk';
import { createExpressServer } from './app';
import { initializeDatabase } from './configs/database';

async function startServer() {
  try {
    const db = await initializeDatabase();
    const app = await createExpressServer(db);

    app.listen(CONFIG.PORT, () => {
      console.log(`🌐 Server running at ${chalk.cyan(`http://localhost:${CONFIG.PORT}`)}`);
      console.log(`📦 DB Mode: ${chalk.green(db.mode)}`);
    });
  } catch (err: any) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  }
}

startServer();
