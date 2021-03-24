import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@vlakyi-org/common';
import { generateMongooseObjID } from '../../../test/utils';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: generateMongooseObjID(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'asdfasdf',
    version: 0
  });

  await order.save();

  const data: OrderCancelledEvent[ 'data' ] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'sdfsdfsdfsdf'
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it('update the status of the order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.status).toBe(OrderStatus.Cancelled);

});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});