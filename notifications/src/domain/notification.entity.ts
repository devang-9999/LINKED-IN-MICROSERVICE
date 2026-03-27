import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  Index,
} from 'typeorm';

export enum NotificationType {
  FOLLOW = 'FOLLOW',
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED = 'CONNECTION_ACCEPTED',
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  senderId: string;

  @Index()
  @Column()
  receiverId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.FOLLOW,
  })
  type: NotificationType;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  senderName: string;

  @Column({ nullable: true })
  senderAvatar: string;
}
