import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@vlakyi-org/common';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';
import { generateMongooseObjID } from '../../../test/utils';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = generateMongooseObjID();
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'adfadf',
  });

  ticket.set({ orderId });

  await ticket.save();

  // Create the fake data event

  const data: OrderCancelledEvent[ 'data' ] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  };

  // Create the fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg, orderId };
};

it('updates the ticket, publishes an event and acks the mesasge', async () => {
  const { ticket, listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});