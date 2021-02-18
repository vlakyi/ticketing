import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

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

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();