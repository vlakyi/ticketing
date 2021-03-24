import { OrderStatus } from '@vlakyi-org/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { generateMongooseObjID } from '../../test/utils';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');
jest.mock('../../nats/publishers/payment-created-publisher');

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

it('returns a 201 with valid inputs', async () => {
  const userId = generateMongooseObjID();

  const order = Order.build({
    id: generateMongooseObjID(),
    version: 0,
    userId,
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();

  const source = 'tok_visa';
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: source,
      orderId: order.id
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[ 0 ][ 0 ];
  const chargeResult = await (stripe.charges.create as jest.Mock).mock.results[ 0 ].value;

  expect(chargeOptions.source).toEqual(source);
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: chargeResult.id
  });

  expect(payment).not.toBeNull();
  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(chargeResult.id);
});