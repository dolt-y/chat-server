import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Index('user_id', ['userId'], {})
@Index('friend_id', ['friendId'], {})
@Entity('friends', { schema: 'chat' })
export class Friends {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '唯一标识每个好友关系记录',
  })
  id: number;

  @Column('int', { name: 'user_id', comment: '用户的 ID' })
  userId: number;

  @Column('int', { name: 'friend_id', comment: '好友的用户 ID' })
  friendId: number;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '好友关系创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToOne(() => User, (user) => user.friends, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => User, (user) => user.friends2, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'friend_id', referencedColumnName: 'id' }])
  friend: User;
}
