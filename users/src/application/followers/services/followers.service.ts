import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follow } from 'src/domain/followers/entities/follow.entity';
import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(OutboxEvent)
    private outboxRepository: Repository<OutboxEvent>,
  ) {}

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following');
    }

    const follow = this.followRepository.create({
      follower: currentUser,
      following: targetUser,
    });

    await this.followRepository.save(follow);

    await this.outboxRepository.save({
      aggregateType: 'follow',
      aggregateId: follow.id,
      eventType: 'user.followed',
      payload: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    return { message: 'User followed successfully' };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow not found');
    }

    await this.followRepository.remove(follow);

    await this.outboxRepository.save({
      aggregateType: 'follow',
      aggregateId: follow.id,
      eventType: 'user.unfollowed',
      payload: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    return { message: 'User unfollowed successfully' };
  }

  async getFollowers(userId: string) {
    const followers = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    return followers.map((f) => f.follower);
  }

  async getFollowing(userId: string) {
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return following.map((f) => f.following);
  }

  async getFollowingCount(userId: string) {
    const count = await this.followRepository.count({
      where: { follower: { id: userId } },
    });

    return { count };
  }
  async getFollowersCount(userId: string) {
    const count = await this.followRepository.count({
      where: { following: { id: userId } },
    });

    return { count };
  }

  async getFollowStatus(currentUserId: string, targetUserId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    return {
      isFollowing: !!follow,
    };
  }
}
