import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './Message.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  receiver: User;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  message_type: string; // 消息类型

  @Column({
    type: 'enum',
    enum: ['sent', 'received', 'read'],
    default: 'sent',
  })
  status: 'sent' | 'received' | 'read'; // 消息状态

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[]; // 表示与该聊天相关的消息
}
