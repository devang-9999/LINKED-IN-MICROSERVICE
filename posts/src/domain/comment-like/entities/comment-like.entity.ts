import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('comment_likes')
@Unique(['userId', 'commentId'])
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  commentId: string;

  @CreateDateColumn()
  createdAt: Date;
}
