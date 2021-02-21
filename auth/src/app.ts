import express, { json } from 'express';
import 'express-async-errors';

// Routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

// Middlewares
import { errorHandler } from './middlewares/error-handler';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);

// Add middlewares
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true
}));

// Add routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);

export { app };