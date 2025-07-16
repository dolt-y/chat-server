import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../shared/entities/Message.entity';
import { Chat } from '../../shared/entities/chat.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    content: string,
    senderId: number,
    chat: Chat,
  ): Promise<Message> {
    const message = this.messageRepository.create({ content, chat });
    return this.messageRepository.save(message);
  }
}
