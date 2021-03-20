import request from 'supertest';
import { app } from '../../app';
import { generateMongooseObjID } from '../../test/utils';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = generateMongooseObjID();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60);

  const order = Order.build({
    ticket,
    userId: 'sfsdfsfsdf',
    status: OrderStatus.Created,
    expiresAt: expiration
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits an order created event');