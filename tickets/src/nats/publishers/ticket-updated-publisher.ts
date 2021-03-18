import { Publisher, Subjects, TicketUpdatedEvent } from '@vlakyi-org/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}