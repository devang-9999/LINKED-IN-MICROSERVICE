import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '../../domain/post/entities/post.entity';
import { PostLike } from 'src/domain/like/entities/post-like.entity';
import { OutboxEvent } from 'src/infrastructure/rabbitmq/outbox/outbox.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,
  ) {}

  async toggleLike(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existing = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    if (existing) {
      await this.likeRepository.delete(existing.id);

      return {
        message: 'Like removed',
        liked: false,
      };
    }

    const like = this.likeRepository.create({
      userId,
      postId,
    });

    await this.likeRepository.save(like);

    if (post.userId !== userId) {
      await this.outboxRepository.save({
        aggregateType: 'post',
        aggregateId: postId,
        eventType: 'post.liked',
        payload: {
          senderId: userId,
          receiverId: post.userId,
          postId: postId,
        },
      });

      console.log('📤 Outbox event created: post.liked');
    }

    return {
      message: 'Post liked',
      liked: true,
    };
  }

  async getPostLikes(postId: string, userId: string) {
    const [count, liked] = await Promise.all([
      this.likeRepository.count({ where: { postId } }),
      this.likeRepository.findOne({ where: { userId, postId } }),
    ]);

    return {
      likesCount: count,
      isLikedByUser: !!liked,
    };
  }
}
