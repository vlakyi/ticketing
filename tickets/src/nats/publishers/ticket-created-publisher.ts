import { Publisher, Subjects, TicketCreatedEvent } from '@vlakyi-org/common/build/nats';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}