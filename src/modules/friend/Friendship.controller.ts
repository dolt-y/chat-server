import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './Friendship.service';
import { Friendship } from '../../shared/entities/Friendship.entity';
import { User } from '../../shared/entities/user.entity';
import { AddFriendDto } from 'src/shared/dto/friend/addFriend.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @ApiOperation({ summary: '添加好友' })
  @Post('add')
  async addFriend(@Body() addFriendDto: AddFriendDto): Promise<Friendship> {
    const { userId, friendId } = addFriendDto;
    return this.friendshipService.createFriendship(userId, friendId);
  }

  @ApiOperation({ summary: '获取好友列表' })
  @Get('list/:userId')
  async getFriendships(@Param('userId') userId: number): Promise<Friendship[]> {
    return this.friendshipService.getFriendships(userId);
  }

  @ApiOperation({ summary: '获取好友信息' })
  @Get('info/:friendshipId')
  async getFriendInfo(
    @Param('friendshipId') friendshipId: number,
  ): Promise<Friendship | null> {
    return this.friendshipService.getFriendInfo(friendshipId);
  }

  @ApiOperation({ summary: '搜索联系人' })
  @Get('search')
  async searchContacts(@Query('query') query: string): Promise<User[]> {
    return this.friendshipService.searchContacts(query);
  }
}
