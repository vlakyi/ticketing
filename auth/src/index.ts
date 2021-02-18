import express from 'express';
import 'express-async-errors';

// Routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

// Middlewares
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(express.json());

// Add routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Add middlewares
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
