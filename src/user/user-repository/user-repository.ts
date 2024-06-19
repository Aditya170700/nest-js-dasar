import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {
    console.log('Create User Repository');
  }

  async save(firstName: string, lastName?: string): Promise<User> {
    return await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    });
  }
}
