import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chats } from './Chats';
import { User } from './User';

@Index('chat_id', ['chatId'], {})
@Index('user_id', ['userId'], {})
@Entity('conversation_members', { schema: 'chat' })
export class ConversationMembers {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '唯一标识每个会话成员记录',
  })
  id: number;

  @Column('int', { name: 'chat_id', comment: '关联的会话 ID' })
  chatId: number;

  @Column('int', { name: 'user_id', comment: '参与者用户 ID' })
  userId: number;

  @Column('datetime', {
    name: 'joined_at',
    nullable: true,
    comment: '用户加入会话的时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt: Date | null;

  @Column('tinyint', {
    name: 'is_admin',
    nullable: true,
    comment: '是否为管理员（适用于群组聊天）',
    width: 1,
    default: () => "'0'",
  })
  isAdmin: boolean | null;

  @ManyToOne(() => Chats, (chats) => chats.conversationMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chat_id', referencedColumnName: 'id' }])
  chat: Chats;

  @ManyToOne(() => User, (user) => user.conversationMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
