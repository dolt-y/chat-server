import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chats } from './Chats.entity';
import { User } from './User.entity';

@Index('chat_id', ['chatId'], {})
@Index('sender_id', ['senderId'], {})
@Entity('messages', { schema: 'chat' })
export class Messages {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '唯一标识每条消息',
  })
  id: number;

  @Column('int', { name: 'chat_id', comment: '关联的会话 ID' })
  chatId: number;

  @Column('int', { name: 'sender_id', comment: '发送者用户 ID' })
  senderId: number;

  @Column('text', { name: 'content', comment: '消息内容' })
  content: string;

  @Column('enum', {
    name: 'type',
    comment: '消息类型，支持文本、图片、文件、视频和音频',
    enum: ['text', 'image', 'file', 'video', 'audio'],
  })
  type: 'text' | 'image' | 'file' | 'video' | 'audio';

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '消息创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('tinyint', {
    name: 'is_read',
    nullable: true,
    comment: '消息是否已读',
    width: 1,
    default: () => "'0'",
  })
  isRead: boolean | null;

  @ManyToOne(() => Chats, (chats) => chats.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'chat_id', referencedColumnName: 'id' }])
  chat: Chats;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'sender_id', referencedColumnName: 'id' }])
  sender: User;
}
