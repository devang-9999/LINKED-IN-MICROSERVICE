import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '../../domain/post/entities/post.entity';
import { PostLike } from 'src/domain/like/entities/post-like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
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
      return { message: 'Like removed' };
    }

    const like = this.likeRepository.create({
      userId,
      postId,
    });

    await this.likeRepository.save(like);

    return { message: 'Post liked' };
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
