import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { ValidationModule } from './validation/validation.module';
import { LogMiddleware } from './log/log.middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './role/role.guard';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      level: 'debug',
      transports: [new winston.transports.Console()],
    }),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ValidationModule.forRoot(true),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LogMiddleware).forRoutes({
      path: '/api/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/api/users/current',
      method: RequestMethod.GET,
    });
  }
}
