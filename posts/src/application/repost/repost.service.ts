import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Repost } from '../../domain/repost/entities/repost.entity';
import { Post } from '../../domain/post/entities/post.entity';
import { CreateRepostMessageDto } from './dto/create-repost-message.dto';

@Injectable()
export class RepostService {
  constructor(
    @InjectRepository(Repost)
    private readonly repostRepository: Repository<Repost>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(data: CreateRepostMessageDto) {
    const { userId, postId, message } = data;

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId === userId) {
      throw new BadRequestException('You cannot repost your own post');
    }

    const existing = await this.repostRepository.findOne({
      where: { userId, postId },
    });

    if (existing) {
      throw new BadRequestException('Already reposted');
    }

    const repost = this.repostRepository.create({
      userId,
      postId,
      message,
    });

    return this.repostRepository.save(repost);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reposts, total] = await this.repostRepository.findAndCount({
      relations: ['post'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      reposts,
      total,
      page,
      limit,
    };
  }

  async findByPost(postId: string, page = 1, limit = 10) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const skip = (page - 1) * limit;

    const [reposts, total] = await this.repostRepository.findAndCount({
      where: { postId },
      relations: ['post'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      reposts,
      total,
      page,
      limit,
    };
  }

  async remove(userId: string, postId: string) {
    const repost = await this.repostRepository.findOne({
      where: { userId, postId },
    });

    if (!repost) {
      throw new NotFoundException('Repost not found');
    }

    await this.repostRepository.delete(repost.id);

    return { message: 'Repost removed successfully' };
  }

  async hasUserReposted(userId: string, postId: string) {
    const repost = await this.repostRepository.findOne({
      where: { userId, postId },
    });

    return !!repost;
  }
}
