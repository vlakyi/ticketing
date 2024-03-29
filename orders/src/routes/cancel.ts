import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@vlakyi-org/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../nats/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats/nats-wrapper';
import { param } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.patch('/api/orders/:orderId',
  requireAuth, [
  param('orderId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Order Id must be provided')
],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled! 
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    res.status(204).send(order);
  });

export { router as cancelOrderRouter };