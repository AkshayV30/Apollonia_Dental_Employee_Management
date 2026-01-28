import { CONFIG } from '../env';
import { connectMongo } from './mongo';
import { loadLocalJson } from './local';

export async function initializeDatabase() {
  switch (CONFIG.DB_MODE) {
    case 'local-json':
      return {
        mode: 'json',
        employees: loadLocalJson('sampleDataFuture.json'),
      };

    case 'local-mongo':
    case 'cloud-mongo':
      await connectMongo();
      return { mode: 'mongo' };

    default:
      throw new Error(`Unsupported DATABASE_MODE: ${CONFIG.DB_MODE}`);
  }
}
