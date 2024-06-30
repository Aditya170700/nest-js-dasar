import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [(new ConfigService()).get('RMQ_URL')] as string[],
          queue: 'email',
          noAck: true,
          queueOptions: {
            durable: true,
            arguments: {
              'x-queue-type': 'quorum',
            }
          }
        }
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
