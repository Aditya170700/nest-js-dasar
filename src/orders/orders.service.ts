import { Injectable } from '@nestjs/common';
import { OrderRequests } from './requests';

@Injectable()
export class OrdersService {
  orders = [];

  create(order: OrderRequests) {
    this.orders.push(order);
    return order;
  }
}
