import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { FriendshipService } from './Friendship.service';
import { Friendship } from '../../shared/entities/Friendship.entity';
import { User } from '../../shared/entities/user.entity';

@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('add')
  async addFriend(
    @Body() body: { friendId: number },
    @Req() req: Request,
  ): Promise<Friendship> {
    const userId = (req.user as { id: number }).id; // 从请求中获取用户 ID
    return this.friendshipService.createFriendship(userId, body.friendId);
  }

  @Get('list/:userId')
  async getFriendships(@Param('userId') userId: number): Promise<Friendship[]> {
    return this.friendshipService.getFriendships(userId);
  }

  @Get('info/:friendshipId')
  async getFriendInfo(
    @Param('friendshipId') friendshipId: number,
  ): Promise<Friendship | null> {
    return this.friendshipService.getFriendInfo(friendshipId);
  }

  @Get('search')
  async searchContacts(@Query('query') query: string): Promise<User[]> {
    return this.friendshipService.searchContacts(query);
  }
}
