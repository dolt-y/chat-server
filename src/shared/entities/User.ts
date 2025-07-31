import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationMembers } from './ConversationMembers';
import { Friends } from './Friends';
import { Messages } from './Messages';

@Index('username', ['username'], { unique: true })
@Entity('user', { schema: 'chat' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '唯一标识每个用户',
  })
  id: number;

  @Column('varchar', {
    name: 'username',
    unique: true,
    comment: '用户的唯一用户名',
    length: 255,
  })
  username: string;

  @Column('varchar', { name: 'password', comment: '用户的密码', length: 255 })
  password: string;

  @Column('varchar', {
    name: 'email',
    nullable: true,
    comment: '用户的电子邮件地址',
    length: 255,
  })
  email: string | null;

  @Column('varchar', {
    name: 'phone',
    nullable: true,
    comment: '用户的电话号码',
    length: 255,
  })
  phone: string | null;

  @Column('varchar', {
    name: 'avatar_url',
    nullable: true,
    comment: '用户头像的 URL',
    length: 255,
  })
  avatarUrl: string | null;

  @Column('text', { name: 'bio', nullable: true, comment: '用户的个人简介' })
  bio: string | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    comment: '用户的在线状态',
    enum: ['online', 'offline', 'away', 'busy'],
    default: () => "'offline'",
  })
  status: 'online' | 'offline' | 'away' | 'busy' | null;

  @Column('datetime', {
    name: 'last_login',
    nullable: true,
    comment: '用户最后登录时间',
  })
  lastLogin: Date | null;

  @Column('timestamp', {
    name: 'created_at',
    comment: '用户创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '用户信息最后更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => ConversationMembers,
    (conversationMembers) => conversationMembers.user,
  )
  conversationMembers: ConversationMembers[];

  @OneToMany(() => Friends, (friends) => friends.user)
  friends: Friends[];

  @OneToMany(() => Friends, (friends) => friends.friend)
  friends2: Friends[];

  @OneToMany(() => Messages, (messages) => messages.sender)
  messages: Messages[];
}
