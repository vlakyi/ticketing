import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@vlakyi-org/common';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { generateMongooseObjID } from '../../../test/utils';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'adfadf'
  });

  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent[ 'data' ] = {
    id: generateMongooseObjID(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdfsdfsdf',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // Create the fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticked updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[ 0 ][ 1 ]);
  expect(ticketUpdatedData.orderId).toEqual(data.id);
});