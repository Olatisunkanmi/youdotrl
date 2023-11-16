import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(identity: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identity }, { username: identity }] },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findbyId(identity: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id: identity },
      include: {
        urls: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

    /**
  * Fetch all Url created by a user
  */
  async findall(): Promise<Array<User>| undefined> {
    const users = await this.prisma.user.findMany({
      include: {
        urls: true
      }
    });
    return users;
  }
}
