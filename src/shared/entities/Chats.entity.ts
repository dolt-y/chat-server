import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatGroups } from './ChatGroups.entity';
import { ConversationMembers } from './ConversationMembers.entity';
import { Messages } from './Messages.entity';

@Entity('chats', { schema: 'chat' })
export class Chats {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '唯一标识每个会话',
  })
  id: number;

  @Column('enum', {
    name: 'type',
    comment: '会话类型，区分一对一聊天和群组聊天',
    enum: ['private', 'group'],
  })
  type: 'private' | 'group';

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '群组名称（如果是群组聊天）',
    length: 255,
  })
  name: string | null;

  @Column('varchar', {
    name: 'avatar',
    nullable: true,
    comment: '群组头像 URL（如果是群组聊天）',
    length: 255,
  })
  avatar: string | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '会话创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '会话最后更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(() => ChatGroups, (chatGroups) => chatGroups.chat)
  chatGroups: ChatGroups[];

  @OneToMany(
    () => ConversationMembers,
    (conversationMembers) => conversationMembers.chat,
  )
  conversationMembers: ConversationMembers[];

  @OneToMany(() => Messages, (messages) => messages.chat)
  messages: Messages[];
}
