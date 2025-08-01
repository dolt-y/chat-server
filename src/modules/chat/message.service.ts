import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from '../../shared/entities/Messages.entity';
import { Chats } from 'src/shared/entities/Chats.entity';
import { ResponseDto } from '../../shared/dto/common/response.dto';
import { MessageDto } from 'src/shared/dto/chat/MessageDto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
  ) {}

  async createMessage(
    content: string,
    senderId: number,
    chat: Chats,
  ): Promise<Messages> {
    const message = this.messageRepository.create({
      content,
      chat,
    });
    return this.messageRepository.save(message);
  }
  async getMessagesByChatId(
    chatId: number,
  ): Promise<ResponseDto<MessageDto[]>> {
    const messages = await this.messageRepository
      .createQueryBuilder('m')
      .select([
        'm.id as messageId',
        'm.content AS content',
        'm.created_at AS createdAt',
        'c.sender_id AS senderId',
        'u_sender.username AS senderUsername',
        'c.receiver_id AS receiverId',
        'u_receiver.username AS receiverUsername',
      ])
      .innerJoin('m.chat', 'c')
      .innerJoin('c.sender', 'u_sender')
      .innerJoin('c.receiver', 'u_receiver')
      .where('c.id = :chatId', { chatId })
      .orderBy('m.created_at', 'ASC')
      .getRawMany();

    const responseData: MessageDto[] = messages.map((message: MessageDto) => ({
      messageId: message.messageId,
      content: message.content,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderUsername: message.senderUsername,
      receiverId: message.receiverId,
      receiverUsername: message.receiverUsername,
    }));

    return new ResponseDto<MessageDto[]>(
      true,
      'Messages fetched successfully',
      responseData,
    );
  }
}
