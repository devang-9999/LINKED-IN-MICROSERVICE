import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Post } from '../../domain/post/entities/post.entity';
import { Comment } from 'src/domain/comment/entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(
    userId: string,
    text: string,
    postId: string,
    parentCommentId?: string,
  ) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (parentCommentId) {
      const parent = await this.commentRepository.findOne({
        where: { id: parentCommentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = this.commentRepository.create({
      text,
      userId,
      postId,
      parentCommentId,
    });

    await this.commentRepository.save(comment);

    return {
      message: parentCommentId ? 'Reply added' : 'Comment added',
      commentId: comment.id,
    };
  }

  async getCommentsByPost(postId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: {
        postId,
        parentCommentId: IsNull(),
        isDeleted: false,
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      comments,
      page,
      limit,
      total,
      hasMore: skip + comments.length < total,
    };
  }

  async getReplies(commentId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [replies, total] = await this.commentRepository.findAndCount({
      where: {
        parentCommentId: commentId,
        isDeleted: false,
      },
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    return {
      replies,
      page,
      limit,
      total,
      hasMore: skip + replies.length < total,
    };
  }

  async deleteComment(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.isDeleted = true;

    await this.commentRepository.save(comment);

    return { message: 'Comment deleted' };
  }
}
