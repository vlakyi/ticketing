import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats/nats-wrapper';
import { TicketCreatedListener } from './nats/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './nats/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './nats/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './nats/listeners/payment-created-listener';

const start = async () => {
  // Checking env
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  // Connection settup
  try {
    const { MONGO_URI, NATS_CLIENT_ID, NATS_URL, NATS_CLUSTER_ID } = process.env;

    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());  // Doesn't work on windows 

    // Adding NATS listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(MONGO_URI, {
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