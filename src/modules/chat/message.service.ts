import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../shared/entities/Message.entity';
import { Chat } from 'src/shared/entities/chat.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    content: string,
    senderId: number,
    chat: Chat,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      content,
      chat,
      message_type: 'text',
    });
    return this.messageRepository.save(message);
  }

  async getMessagesByChatId(chatId: number): Promise<any[]> {
    this.logger.log(`Fetching messages for chat ID: ${chatId}`);

    // 使用 createQueryBuilder 进行连表查询
    const messages = await this.messageRepository
      .createQueryBuilder('m')
      .innerJoinAndSelect('m.chat', 'c') // 连接 chat 表
      .innerJoinAndSelect('c.sender', 'u_sender') // 连接发送者
      .innerJoinAndSelect('c.receiver', 'u_receiver') // 连接接收者
      .where('c.id = :chatId', { chatId }) // 使用 chat 表的 ID 进行过滤
      .orderBy('m.created_at', 'ASC')
      .getMany();

    // 返回消息和发送者、接收者信息
    return messages.map((message) => ({
      messageId: message.id,
      content: message.content,
      createdAt: message.created_at,
      senderId: message.chat.sender.id, // 从 chat 表中获取发送者 ID
      senderUsername: message.chat.sender.username, // 发送者用户名
      receiverId: message.chat.receiver.id, // 从 chat 表中获取接收者 ID
      receiverUsername: message.chat.receiver.username, // 接收者用户名
    }));
  }
}
