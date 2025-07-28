import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../../shared/entities/Friendship.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createFriendship(
    userId: number,
    friendId: number,
  ): Promise<Friendship> {
    const friendship = this.friendshipRepository.create({
      user: { id: userId } as User,
      friend: { id: friendId } as User,
      status: 'pending',
    });
    return this.friendshipRepository.save(friendship);
  }

  async getFriendships(userId: number): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      where: { user: { id: userId } },
      relations: ['friend'],
    });
  }

  async getFriendInfo(friendshipId: number): Promise<Friendship | null> {
    return this.friendshipRepository.findOne({
      where: { id: friendshipId },
      relations: ['friend'],
    });
  }

  async searchContacts(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }, { phone: query }],
    });
  }
}
