import { TicketCreatedEvent } from '@vlakyi-org/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../nats-wrapper';
import { generateMongooseObjID } from '../../../test/utils';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent[ 'data' ] = {
    version: 0,
    id: generateMongooseObjID(),
    title: 'concert',
    price: 10,
    userId: generateMongooseObjID()
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it('created and saves a ticket', async () => {
  const { listener, data, msg } = setup();

  // call the onMessage function with the data object + message object

  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  const ticket = await Ticket.findById(data.id);

  expect(ticket).not.toBeNull();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);

});

it('acks the message', async () => {
  const { listener, data, msg } = setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});