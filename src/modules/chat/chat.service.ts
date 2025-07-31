import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chats } from '../../shared/entities/Chats';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    private readonly chatRepository: Repository<Chats>,
  ) {}

  async findChatById(chatId: number): Promise<Chats | null> {
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
