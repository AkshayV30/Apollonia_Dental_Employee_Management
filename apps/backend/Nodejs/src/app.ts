import express from 'express';
import morgan from 'morgan';
import router from './routes';

import { corsMiddleware } from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

export function createExpressServer(db: any) {
  const app = express();

  app.use(morgan('dev'));
  app.use(corsMiddleware);
  app.use(express.json());

  if (db.mode === 'json') {
    app.get('/api/employees', (req, res) => res.json(db.employees));
  } else {
    app.use('/api', router);
  }

  app.get('/', (_, res) => res.send('Server running'));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
