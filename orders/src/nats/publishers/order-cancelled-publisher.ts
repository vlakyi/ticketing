import { Publisher, OrderCancelledEvent, Subjects } from '@vlakyi-org/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}