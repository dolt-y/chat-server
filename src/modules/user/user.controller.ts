import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Param,
  Post,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UpdateUserDto } from '../../shared/dto/user/update-user.dto';
import { Request } from 'express';
import { User } from 'src/shared/entities/User.entity';
import { PaginationDto } from 'src/shared/dto/Pagination/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '根据ID查找用户信息' })
  async getProfile(@Req() req: Request) {
    const user = await this.userService.findOne(
      (req.user as { id: number }).id,
    );
    return user;
  }

  @Post('me')
  @ApiOperation({ summary: '更新用户信息' })
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const userId = updateUserDto.id;
    return this.userService.updateProfile(userId, updateUserDto);
  }

  @Get(':username')
  @ApiOperation({ summary: '根据用户名查找用户信息' })
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      return user;
    }
    return {
      message: '用户不存在',
    };
  }

  @Post('all')
  @ApiOperation({ summary: '获取所有用户信息' })
  async getAllUsers(
    @Body() paginationDto: PaginationDto,
  ): Promise<{ users: User[]; total: number }> {
    this.logger.log(paginationDto);
    return this.userService.findAll(paginationDto);
  }
}
