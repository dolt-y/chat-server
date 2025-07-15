import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UpdateUserDto } from '../../shared/dto/user/update-user.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = await this.userService.findOne(
      (req.user as { id: number }).id,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateProfile(
      (req.user as { id: number }).id,
      updateUserDto,
    );
    return user;
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      return user;
    }
    return null;
  }
}
