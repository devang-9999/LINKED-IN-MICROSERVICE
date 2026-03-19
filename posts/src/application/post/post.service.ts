import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '../../domain/post/entities/post.entity';
import { CreatePostMessageDto } from './dto/create-post-message.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostLike } from '../../domain/like/entities/post-like.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,
  ) {}

  async create(data: CreatePostMessageDto): Promise<Post> {
    const post = this.postRepository.create(data);
    return this.postRepository.save(post);
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const result = await Promise.all(
      posts.map(async (post) => {
        const liked = await this.likeRepository.findOne({
          where: { userId, postId: post.id },
        });

        return {
          ...post,
          isLiked: !!liked,
        };
      }),
    );

    return {
      posts: result,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const liked = await this.likeRepository.findOne({
      where: { userId, postId: id },
    });

    return {
      ...post,
      isLiked: !!liked,
    };
  }

  async update(id: string, userId: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You cannot edit this post');
    }

    Object.assign(post, dto);

    return this.postRepository.save(post);
  }

  async remove(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You cannot delete this post');
    }

    await this.postRepository.delete(id);

    return { message: 'Post deleted successfully' };
  }
}
