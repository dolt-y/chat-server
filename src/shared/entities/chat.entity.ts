import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './Message.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number; // 聊天的唯一标识符

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' }) // 指定外键字段名称
  sender: User; // 发送者

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'receiver_id' }) // 指定外键字段名称
  receiver: User; // 接收者

  @Column('text')
  message: string; // 聊天内容

  @Column({ nullable: true })
  message_type: string; // 消息类型

  @Column({
    type: 'enum',
    enum: ['sent', 'received', 'read'],
    default: 'sent',
  })
  status: 'sent' | 'received' | 'read'; // 消息状态

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date; // 消息创建时间

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[]; // 与该聊天相关的消息
}
