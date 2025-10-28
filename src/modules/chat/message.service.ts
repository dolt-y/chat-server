import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from '../../shared/entities/Messages.entity';
import { Chats } from 'src/shared/entities/Chats.entity';
import { ResponseDto } from '../../shared/dto/common/response.dto';
import { MessageDto } from 'src/shared/dto/chat/response/MessageDto';
import { GetMessageDto } from 'src/shared/dto/chat/request/getMessageDto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
  ) { }

  async createMessage(
    content: string,
    senderId: number,
    chat: Chats,
    type: 'text' | 'image' | 'file' | 'video' | 'audio' = 'text',
  ): Promise<Messages> {
    const message = this.messageRepository.create({
      content,
      senderId,
      chatId: chat.id,
      type,
    });
    const savedMessage = await this.messageRepository.save(message);
    return await this.messageRepository.findOneOrFail({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });
  }
  /**
   * @description 获取指定会话的消息列表
   */
  async getMessagesByChatId(getMessageDto: GetMessageDto): Promise<ResponseDto<MessageDto[]>> {
    const { chatId, page, pageSize } = getMessageDto;
    const skipCount = (page - 1) * pageSize;
    const messages = await this.messageRepository.find({
      where: { chatId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: skipCount,
      take: pageSize,
    });
    const responseData: MessageDto[] = messages.map((message) => ({
      messageId: message.id,
      content: message.content,
      createdAt: message.createdAt || new Date(),
      senderId: message.sender.id,
      senderUsername: message.sender.username,
      senderAvatar: message.sender.avatarUrl || '',
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
