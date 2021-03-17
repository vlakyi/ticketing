import { Publisher, Subjects, TicketUpdatedEvent } from '@vlakyi-org/common/build/nats';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}