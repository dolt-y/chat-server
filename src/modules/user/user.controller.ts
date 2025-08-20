import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Logger,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UpdateUserDto } from '../../shared/dto/user/update-user.dto';
import { User } from 'src/shared/entities/User.entity';
import { PaginationDto } from 'src/shared/dto/Pagination/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @ApiOperation({ summary: '根据ID查找用户信息' })
  async getProfile(@Query('userId') userId: number) {
    return await this.userService.findOne(userId);
  }

  @Get('info')
  @ApiOperation({ summary: '根据用户名查找用户信息' })
  async getUserByUsername(@Query('username') username: string) {
    return await this.userService.findByUsername(username);
  }

  @Post('me')
  @ApiOperation({ summary: '更新用户信息' })
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.updateProfile(updateUserDto.id, updateUserDto);
  }

  @Post('all')
  @ApiOperation({ summary: '获取所有用户信息' })
  async getAllUsers(
    @Body() paginationDto: PaginationDto,
  ): Promise<{ users: User[]; total: number }> {
    return this.userService.findAll(paginationDto);
  }
}
