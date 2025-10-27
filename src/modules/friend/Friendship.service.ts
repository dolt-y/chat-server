import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from '../../shared/entities/Friends.entity';
import { User } from '../../shared/entities/User.entity';
import { ResponseDto } from '../../shared/dto/common/response.dto'; // 引入统一响应DTO

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friends)
    private friendshipRepository: Repository<Friends>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createFriendship(userId: number, friendId: number): Promise<ResponseDto<Friends>> {
    try {
      const friendship = this.friendshipRepository.create({
        user: { id: userId },
        friend: { id: friendId },
      });
      const saved = await this.friendshipRepository.save(friendship);
      return new ResponseDto(true, '好友关系创建成功', saved);
    } catch (error) {
      return new ResponseDto(false, '创建失败', error.message);
    }
  }

  async getFriendships(userId: number): Promise<ResponseDto<Friends[]>> {
    try {
      const list = await this.friendshipRepository.find({
        where: { user: { id: userId } },
        relations: ['friend'],
      });
      return new ResponseDto(true, '获取成功', list);
    } catch (error) {
      return new ResponseDto(false, '获取失败', [], error.message);
    }
  }

  async getFriendInfo(friendshipId: number): Promise<ResponseDto<Friends | null>> {
    try {
      const info = await this.friendshipRepository.findOne({
        where: { id: friendshipId },
        relations: ['friend'],
      });
      return new ResponseDto(true, '获取成功', info);
    } catch (error) {
      return new ResponseDto(false, '获取失败', null, error.message);
    }
  }

  async searchContacts(query: string): Promise<ResponseDto<User[]>> {
    try {
      const users = await this.userRepository.find({
        where: [{ username: query }, { email: query }, { phone: query }],
      });
      return new ResponseDto(true, '搜索成功', users);
    } catch (error) {
      return new ResponseDto(false, '搜索失败', [], error.message);
    }
  }
}