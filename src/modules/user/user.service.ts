import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/User.entity';
import { PaginationDto } from 'src/shared/dto/Pagination/pagination.dto';
import { UpdateUserDto } from 'src/shared/dto/user/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateProfile(
    id: number,
    updateData: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    await this.userRepository.update(id, updateData);
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ users: User[]; total: number }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, total };
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
