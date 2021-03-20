import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if the requested order belongs to another user', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();
  const anotherUser = global.signin();

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch another user the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', anotherUser)
    .send()
    .expect(401);
});

it("returns an error if the requested order doesn't exist", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();
  // make a request to build an order with this ticket

  await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch not existing order
  const notExistingId = '60566fd53a37a83111111111';
  await request(app)
    .get(`/api/orders/${notExistingId}`)
    .set('Cookie', user)
    .send()
    .expect(404);
});

it("returns an error if the request is not authorized", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();
  // make a request to build an order with this ticket

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch order without authorization
  await request(app)
    .get(`/api/orders/${order.id}`)
    .send()
    .expect(401);
});