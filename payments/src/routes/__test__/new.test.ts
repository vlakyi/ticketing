import { OrderStatus } from '@vlakyi-org/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { generateMongooseObjID } from '../../test/utils';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'sdfsdfsdf',
      orderId: generateMongooseObjID()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: generateMongooseObjID(),
    version: 0,
    userId: generateMongooseObjID(),
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'sdfsdfsdf',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = generateMongooseObjID();

  const order = Order.build({
    id: generateMongooseObjID(),
    version: 0,
    userId,
    price: 20,
    status: OrderStatus.Cancelled
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'sdfsdfsdf',
      orderId: order.id
    })
    .expect(400);
});