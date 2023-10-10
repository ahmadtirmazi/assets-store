'use strict'

import { NextFunction, Request, Response } from 'express';

import { RouteNotFoundHandler } from './middlewares/route-not-found.handler';
import cors from 'cors'
import express from 'express'
import { getDbClient } from './getDbClient'
import userRoutes from './endpoints/routes';

const PORT = 3001
const HOST = '0.0.0.0'

const client = getDbClient()

const app = express()
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(RouteNotFoundHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('an unhandled error occured');
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
  console.info("Closing server now...");

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.info("Closing server now...");

  process.exit(1);
});

app.listen(PORT, HOST, () => {
  console.info(`Running on http://${HOST}:${PORT}`)
  console.info(`Connected to database "${client.database}"`)
})
