import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '../../shared/entities/Friendship.entity'; // 确保路径正确
import { FriendshipService } from './Friendship.service';
import { FriendshipController } from './Friendship.controller';
import { User } from 'src/shared/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
