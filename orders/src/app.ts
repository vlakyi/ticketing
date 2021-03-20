import express, { json } from 'express';
import 'express-async-errors';

// Routes
import { cancelOrderRouter } from './routes/cancel';
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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
app.use(cancelOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(errorHandler);

export { app };