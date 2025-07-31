import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from '../../shared/entities/Friends';
import { User } from '../../shared/entities/User';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friends)
    private friendshipRepository: Repository<Friends>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createFriendship(userId: number, friendId: number): Promise<Friends> {
    const friendship = this.friendshipRepository.create({
      user: { id: userId } as User,
      friend: { id: friendId } as User,
      status: 'pending',
    });
    return this.friendshipRepository.save(friendship);
  }

  async getFriendships(userId: number): Promise<Friends[]> {
    return this.friendshipRepository.find({
      where: { user: { id: userId } },
      relations: ['friend'],
    });
  }

  async getFriendInfo(friendshipId: number): Promise<Friends | null> {
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
