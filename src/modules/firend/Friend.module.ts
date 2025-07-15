import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '../../shared/entities/Friendship.entity'; // 确保路径正确
import { FriendshipService } from './Friendship.service';
import { FriendshipController } from './Friendship.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship])],
  providers: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
