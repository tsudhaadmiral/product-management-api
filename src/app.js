import express from 'express';
import productsRouter from './routes/products.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/products', productsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}