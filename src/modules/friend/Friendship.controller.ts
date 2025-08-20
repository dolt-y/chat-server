import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './Friendship.service';
import { Friends } from '../../shared/entities/Friends.entity';
import { User } from '../../shared/entities/User.entity';
import { AddFriendDto } from 'src/shared/dto/friend/addFriend.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @ApiOperation({ summary: '添加好友' })
  @Post('add')
  async addFriend(@Body() addFriendDto: AddFriendDto): Promise<Friends> {
    const { userId, friendId } = addFriendDto;
    return this.friendshipService.createFriendship(userId, friendId);
  }

  @ApiOperation({ summary: '获取好友列表' })
  @Get('list')
  async getFriendships(
    @Query('userId') userId: number,
  ): Promise<Friends[]> {
    return this.friendshipService.getFriendships(userId);
  }

  @ApiOperation({ summary: '获取好友信息' })
  @Get('info')
  async getFriendInfo(
    @Query('friendshipId') friendshipId: number,
  ): Promise<Friends | null> {
    return this.friendshipService.getFriendInfo(friendshipId);
  }

  @ApiOperation({ summary: '搜索联系人' })
  @Get('search')
  async searchContacts(@Query('query') query: string): Promise<User[]> {
    return this.friendshipService.searchContacts(query);
  }
}
