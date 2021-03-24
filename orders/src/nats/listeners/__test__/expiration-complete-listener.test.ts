import { ExpirationCompleteEvent, OrderStatus } from '@vlakyi-org/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../nats-wrapper';
import { generateMongooseObjID } from '../../../test/utils';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: generateMongooseObjID(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sdfsdfsd',
    expiresAt: new Date(),
    ticket
  });

  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent[ 'data' ] = {
    orderId: order.id
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[ 0 ][ 1 ]);
  expect(eventData.id).toEqual(order.id);

});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});