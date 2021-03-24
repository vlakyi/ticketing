import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@vlakyi-org/common';
import { QUEUE_GROUP_NAME } from '../../constants/payments';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName = QUEUE_GROUP_NAME;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  async onMessage (data: OrderCancelledEvent[ 'data' ], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}