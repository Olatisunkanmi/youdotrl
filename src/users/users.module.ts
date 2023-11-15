import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import UserController from "./users.controller"

@Module({
  exports: [UsersService],
  providers: [PrismaService, UsersService],
  controllers: [UserController]
})
export class UsersModule {}
