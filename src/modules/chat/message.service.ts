import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from '../../shared/entities/Messages.entity';
import { Chats } from 'src/shared/entities/Chats.entity';
import { ResponseDto } from '../../shared/dto/common/response.dto';
import { MessageDto } from 'src/shared/dto/chat/response/MessageDto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
  ) { }

  async createMessage(
    content: string,
    chat: Chats,
  ): Promise<Messages> {
    const message = this.messageRepository.create({
      content,
      chat,
    });
    return this.messageRepository.save(message);
  }

  /**
   * @description 获取指定会话的消息列表
   */
  async getMessagesByChatId(
    chatId: number,
  ): Promise<ResponseDto<MessageDto[]>> {
    const messages = await this.messageRepository.find({
      where: { chatId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });

    const responseData: MessageDto[] = messages.map((message) => ({
      messageId: message.id,
      content: message.content,
      createdAt: message.createdAt || new Date(),
      senderId: message.sender.id,
      senderUsername: message.sender.username,
      isRead: message.isRead,
      type: message.type,
    }));

    return new ResponseDto<MessageDto[]>(
      true,
      '获取成功',
      responseData,
    );
  }
}
