import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['private', 'group'],
    nullable: false,
  })
  type: 'private' | 'group';

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string | null; // 群组名称（如果是群组聊天）

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatar: string | null; // 群组头像 URL（如果是群组聊天）

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
