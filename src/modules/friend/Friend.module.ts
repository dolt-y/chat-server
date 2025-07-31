import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from '../../shared/entities/Friends'; // 确保路径正确
import { FriendshipService } from './Friendship.service';
import { FriendshipController } from './Friendship.controller';
import { User } from 'src/shared/entities/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friends]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
