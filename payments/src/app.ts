import express, { json } from 'express';
import 'express-async-errors';

// Routes
import { createChargeRouter } from './routes/new';

// Middlewares
import { errorHandler, currentUser } from '@vlakyi-org/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);

// Add middlewares
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

// Routes
app.use(createChargeRouter);
app.use(errorHandler);

export { app };