import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info('Create User Repository');
  }

  async save(firstName: string, lastName?: string): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    });

    this.logger.info(`Create User Data ${JSON.stringify(user)}`);

    return user;
  }
}
