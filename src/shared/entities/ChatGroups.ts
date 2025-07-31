import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chats } from './Chats';

@Index('chat_id', ['chatId'], {})
@Entity('chat_groups', { schema: 'chat' })
export class ChatGroups {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '唯一标识每个群组',
  })
  id: number;

  @Column('int', { name: 'chat_id', comment: '关联的会话 ID' })
  chatId: number;

  @Column('varchar', { name: 'group_name', comment: '群组名称', length: 255 })
  groupName: string;

  @Column('varchar', {
    name: 'avatar',
    nullable: true,
    comment: '群组头像 URL',
    length: 255,
  })
  avatar: string | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '群组创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '群组最后更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(() => Chats, (chats) => chats.chatGroups, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chat_id', referencedColumnName: 'id' }])
  chat: Chats;
}
