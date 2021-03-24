import { Publisher, OrderCreatedEvent, Subjects } from '@vlakyi-org/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}