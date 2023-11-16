import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/auth.public.decorator';
import { RequestUser } from '../common/interfaces';

@ApiTags('USERs')
@Controller()
class UserControlller {
  constructor(private readonly userServices: UsersService) {}

  /**
   * Find a user by Id
   */
  @Public()
  @Post('users/:id')
  async fetchUserById(@Param('id') userId: string, @Req() req: RequestUser) {
    return this.userServices.findbyId(userId);
  }

  /**
   * Find all users
   */
  @Public()
  @Get('users/all')
  async fetchAllUsers(@Req() req: RequestUser) {
    return this.userServices.findall()
  }
}

export default UserControlller;
