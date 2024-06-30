import { Body, Controller, Inject, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRequests } from './requests';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(
    private orderService: OrdersService,
    @Inject('EMAIL_QUEUE') private readonly client: ClientProxy
  ) {
  }

  @Post()
  async create(@Body() payload: OrderRequests) {
    this.client.emit('order_created', payload);
    return this.orderService.create(payload);
  }
}
