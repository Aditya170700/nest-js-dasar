import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
  constructor() {
    super();
    console.log('Create Prisma Service');
  }

  async onModuleInit(): Promise<void> {
    console.log('Connect to db');
    this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    console.log('Disconnect to db');
    this.$disconnect();
  }
}
