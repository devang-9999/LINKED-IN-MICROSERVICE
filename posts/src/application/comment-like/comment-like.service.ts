import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentLike } from '../../domain/comment-like/entities/comment-like.entity';
import { Comment } from '../../domain/comment/entities/comment.entity';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly likeRepository: Repository<CommentLike>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async toggleLike(userId: string, commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existing = await this.likeRepository.findOne({
      where: { userId, commentId },
    });

    if (existing) {
      await this.likeRepository.delete(existing.id);
      return { message: 'Like removed' };
    }

    const like = this.likeRepository.create({
      userId,
      commentId,
    });

    await this.likeRepository.save(like);

    return { message: 'Comment liked' };
  }

  async getCommentLikes(commentId: string, userId: string) {
    const [count, liked] = await Promise.all([
      this.likeRepository.count({ where: { commentId } }),
      this.likeRepository.findOne({ where: { userId, commentId } }),
    ]);

    return {
      likesCount: count,
      isLikedByUser: !!liked,
    };
  }
}
