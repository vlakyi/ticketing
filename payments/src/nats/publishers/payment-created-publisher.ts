import { PaymentCreatedEvent, Publisher, Subjects } from '@vlakyi-org/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}