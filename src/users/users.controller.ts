import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }
  @Get('findByUsername')
  async findByUsername(@Query('username') username: string) {
    return this.usersService.findByUsername(username);
  }
  @Get('findAll')
  findAll() {
    return this.usersService.findAllUsers();
  }
}
