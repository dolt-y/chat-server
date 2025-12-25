import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationMembers } from '../../shared/entities/ConversationMembers.entity';
import { Messages } from '../../shared/entities/Messages.entity';
import { ChatListItemDto } from 'src/shared/dto/chat/response/ChatListItemDto';
import { Chats } from 'src/shared/entities/Chats.entity';
import { ResponseDto } from 'src/shared/dto/common/response.dto';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    private readonly chatsRepository: Repository<Chats>,
    @InjectRepository(ConversationMembers)
    private readonly conversationMembersRepository: Repository<ConversationMembers>,
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) { }

  async findChatById(chatId: number): Promise<Chats | null> {
    return this.chatsRepository.findOne({
      where: { id: chatId },
    });
  }

  async getUserChatsOptimized(userId: number): Promise<ResponseDto<ChatListItemDto[]>> {
    // 获取用户参与的所有会话基本信息
    const members = await this.conversationMembersRepository
      .createQueryBuilder('cm')
      .leftJoinAndSelect('cm.chat', 'chat')
      .where('cm.userId = :userId', { userId })
      .getMany();

    if (!members.length) {
      return new ResponseDto(true, '没有会话', []);
    }

    const chatIds = members.map(m => m.chat.id);

    // 批量获取最后一条消息
    const lastMessages = await this.getLastMessagesBatch(chatIds);

    // 批量获取未读消息数量
    const unreadCounts = await this.getUnreadCountsBatch(chatIds, userId);

    // 构建会话列表
    const chatList = members.map(member => {
      const chatId = member.chat.id;
      return {
        chatId,
        chatType: member.chat.type,
        chatName: member.chat.name,
        chatAvatar: member.chat.avatar,
        createdAt: member.chat.createdAt,
        updatedAt: member.chat.updatedAt,
        isAdmin: member.isAdmin,
        joinedAt: member.joinedAt,
        lastMessage: lastMessages[chatId] || null,
        unreadCount: unreadCounts[chatId] || 0,
      };
    });

    // 根据 lastMessage.createdAt 排序（最新的在前面）
    chatList.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return new ResponseDto(true, '获取会话列表成功', chatList);
  }



  /** 批量获取每个会话的最新消息 */
  private async getLastMessagesBatch(chatIds: number[]): Promise<Record<number, any>> {
    if (!chatIds.length) return {};

    const lastMessages = await this.messagesRepository
      .createQueryBuilder('m')
      .distinctOn(['m.chat_id'])
      .where('m.chat_id IN (:...chatIds)', { chatIds })
      .orderBy('m.chat_id')
      .addOrderBy('m.created_at', 'ASC')
      .select([
        'm.chat_id AS "chatId"',
        'm.content AS "content"',
        'm.type AS "type"',
        'm.created_at AS "createdAt"',
      ])
      .getRawMany();

    return Object.fromEntries(
      lastMessages.map(m => [
        m.chatId,
        { content: m.content, type: m.type, createdAt: m.createdAt },
      ]),
    );
  }

  /** 批量获取每个会话的未读消息数量 */
  private async getUnreadCountsBatch(chatIds: number[], userId: number): Promise<Record<number, number>> {
    if (!chatIds.length) return {};

    const unreadCounts = await this.messagesRepository
      .createQueryBuilder('m')
      .select('m.chat_id', 'chatId')
      .addSelect('COUNT(*)', 'count')
      .where('m.chat_id IN (:...chatIds)', { chatIds })
      .andWhere('m.is_read = :isRead', { isRead: false })
      .andWhere('m.sender_id != :userId', { userId })
      .groupBy('m.chat_id')
      .getRawMany();

    return unreadCounts.reduce((acc, item) => {
      acc[item.chatId] = parseInt(item.count, 10) || 0;
      return acc;
    }, {} as Record<number, number>);
  }

  /** 批量获取参与者信息（排除当前用户） */
  private async getChatParticipantsBatch(chatIds: number[], currentUserId: number): Promise<Record<number, any[]>> {
    if (!chatIds.length) return {};

    const participants = await this.conversationMembersRepository
      .createQueryBuilder('cm')
      .innerJoin('cm.user', 'u')
      .select([
        'cm.chat_id AS chatId',
        'u.id AS userId',
        'u.username AS username',
        'u.avatar_url AS avatarUrl',
        'u.status AS status',
        'cm.is_admin AS isAdmin'
      ])
      .where('cm.chat_id IN (:...chatIds)', { chatIds })
      .andWhere('cm.user_id != :currentUserId', { currentUserId })
      .getRawMany();

    return participants.reduce((acc, p) => {
      if (!acc[p.chatId]) acc[p.chatId] = [];
      acc[p.chatId].push({
        userId: p.userId,
        username: p.username,
        avatarUrl: p.avatarUrl,
        status: p.status,
        isAdmin: p.isAdmin,
      });
      return acc;
    }, {} as Record<number, any[]>);
  }
}
