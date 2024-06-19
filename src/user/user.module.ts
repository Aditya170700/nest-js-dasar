import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Connection, createConnection, MongoDBConnection, MySQLConnection } from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
import { createUserRepository, UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    },
    {
      provide: MailService,
      useValue: mailService,
    },
    {
      provide: UserRepository,
      useFactory: createUserRepository,
      inject: [Connection],
    },
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    MemberService,
  ],
  exports: [UserService],
})
export class UserModule {}
