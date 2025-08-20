import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chats } from '../../shared/entities/Chats.entity';
import { ConversationMembers } from '../../shared/entities/ConversationMembers.entity';
import { Messages } from '../../shared/entities/Messages.entity';
import { ChatListItemDto } from 'src/shared/dto/chat/response/ChatListItemDto';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    @InjectRepository(ConversationMembers)
    private readonly conversationMembersRepository: Repository<ConversationMembers>,
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) { }

  async getUserChatsOptimized(userId: number): Promise<ChatListItemDto[]> {
    // 获取用户参与的所有会话基本信息
    const members = await this.conversationMembersRepository.find({
      where: { userId },
      relations: ['chat'],
      order: { chat: { updatedAt: 'DESC' } },
    });

    if (!members.length) return [];

    const chatIds = members.map(m => m.chat.id);

    // 批量获取最后一条消息
    const lastMessages = await this.getLastMessagesBatch(chatIds);

    // 批量获取未读消息数量
    const unreadCounts = await this.getUnreadCountsBatch(chatIds, userId);

    // 批量获取参与者信息
    const allParticipants = await this.getChatParticipantsBatch(chatIds, userId);

    return members.map(member => {
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
        participants: allParticipants[chatId] || [],
      };
    });
  }

  /** 批量获取每个会话的最新消息 */
  private async getLastMessagesBatch(chatIds: number[]): Promise<Record<number, any>> {
    if (!chatIds.length) return {};

    const lastMessages = await this.messagesRepository
      .createQueryBuilder('m')
      .innerJoin('m.sender', 'u')
      .where('m.chat_id IN (:...chatIds)', { chatIds })
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('MAX(m2.created_at)')
          .from(Messages, 'm2')
          .where('m2.chat_id = m.chat_id')
          .getQuery();
        return 'm.created_at = ' + subQuery;
      })
      .select([
        'm.id AS id',
        'm.chat_id AS chatId',
        'm.content AS content',
        'm.type AS type',
        'm.created_at AS createdAt',
        'm.sender_id AS senderId',
        'u.username AS senderUsername',
      ])
      .getRawMany();

    return lastMessages.reduce((acc, msg) => {
      acc[msg.chatId] = {
        id: msg.id,
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
        senderId: msg.senderId,
        senderUsername: msg.senderUsername,
      };
      return acc;
    }, {} as Record<number, any>);
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
