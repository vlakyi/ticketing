import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@vlakyi-org/common';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from '../../constants/orders';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage (data: TicketCreatedEvent[ 'data' ], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id, title, price
    });

    await ticket.save();

    msg.ack();
  }
}