import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../shared/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async findChatById(chatId: number): Promise<Chat | null> {
    return this.chatRepository.findOne({ where: { id: chatId } });
  }
  async isUserInChat(chatId: number, senderId: number): Promise<boolean> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['users'],
    });
    if (!chat) {
      return false;
    }
    return chat.users && chat.users.some((user) => user.id === senderId);
  }
}
