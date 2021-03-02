import express, { json } from 'express';
import 'express-async-errors';

// Middlewares
import { errorHandler } from '@vlakyi-org/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);

// Add middlewares
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

export { app };