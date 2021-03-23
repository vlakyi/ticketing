import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@vlakyi-org/common';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from '../../constants/orders';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage (data: TicketUpdatedEvent[ 'data' ], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}