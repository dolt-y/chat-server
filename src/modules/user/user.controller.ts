import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UpdateUserDto } from '../../shared/dto/user/update-user.dto';
import { Request } from 'express';
import { User } from 'src/shared/entities/user.entity';
import { PaginationDto } from 'src/shared/dto/Pagination/pagination.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* 根据ID查找用户信息 */
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = await this.userService.findOne(
      (req.user as { id: number }).id,
    );
    return user;
  }

  /* 更新用户信息 */
  @Post('me')
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const userId = updateUserDto.id;
    return this.userService.updateProfile(userId, updateUserDto);
  }

  /* 根据用户名查找用户信息 */
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      return user;
    }
    return new HttpException('没有找到该用户', HttpStatus.BAD_REQUEST);
  }

  /* 获取所有用户信息 */
  @Post('all')
  async getAllUsers(
    @Body() paginationDto: PaginationDto,
  ): Promise<{ users: User[]; total: number }> {
    return this.userService.findAll(paginationDto);
  }
}
