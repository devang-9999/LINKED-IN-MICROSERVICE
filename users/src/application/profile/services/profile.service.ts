/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

import { UpdateUserDto } from '../dto/update-user.dto';
import { Follow } from 'src/domain/followers/entities/follow.entity';
import {
  Connection,
  ConnectionStatus,
} from 'src/domain/connections/entities/connection.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,

    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['educations', 'experiences', 'skills'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getMyProfile(userId: string) {
    return this.findUser(userId);
  }

  async getPublicProfile(userId: string) {
    return this.findUser(userId);
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
    profilePicture?: string,
    coverPicture?: string,
  ) {
    const user = await this.findUser(userId);

    // ✅ Update text fields safely
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.headline !== undefined) user.headline = dto.headline;
    if (dto.about !== undefined) user.about = dto.about;

    // ✅ Update images if provided
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    if (coverPicture) {
      user.coverPicture = coverPicture;
    }

    const updated = await this.userRepository.save(user);

    await this.outboxRepository.save({
      aggregateType: 'profile',
      aggregateId: updated.id,
      eventType: 'profile.updated',
      payload: {
        userId: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        headline: updated.headline,
        profilePicture: updated.profilePicture,
        coverPicture: updated.coverPicture,
      },
    });

    return updated;
  }

  async updateProfilePicture(userId: string, filename: string) {
    const user = await this.findUser(userId);

    user.profilePicture = filename;

    const updated = await this.userRepository.save(user);

    await this.outboxRepository.save({
      aggregateType: 'profile',
      aggregateId: updated.id,
      eventType: 'profile.picture.updated',
      payload: {
        userId: updated.id,
        profilePicture: filename,
      },
    });

    return updated;
  }

  async updateCoverPicture(userId: string, filename: string) {
    const user = await this.findUser(userId);

    user.coverPicture = filename;

    const updated = await this.userRepository.save(user);

    await this.outboxRepository.save({
      aggregateType: 'profile',
      aggregateId: updated.id,
      eventType: 'profile.cover.updated',
      payload: {
        userId: updated.id,
        coverPicture: filename,
      },
    });

    return updated;
  }

  async getSuggestions(currentUserId: string) {
    const follows = await this.followRepository.find({
      where: { follower: { id: currentUserId } },
      relations: ['following'],
    });

    const followedIds = follows.map((f) => f.following?.id).filter(Boolean);

    const connections = await this.connectionRepository.find({
      where: [
        { sender: { id: currentUserId } },
        { receiver: { id: currentUserId } },
      ],
      relations: ['sender', 'receiver'],
    });

    const connectionMap = new Map();

    connections.forEach((c) => {
      const otherUserId =
        c.sender?.id === currentUserId ? c.receiver?.id : c.sender?.id;

      if (!otherUserId) return;

      connectionMap.set(otherUserId, {
        status: c.status,
        isSender: c.sender?.id === currentUserId,
      });
    });

    const users = await this.userRepository.find({
      where: {
        id: Not(In([currentUserId])),
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'headline',
        'profilePicture',
        'coverPicture',
      ],
      take: 20,
    });

    return Promise.all(
      users
        .filter((user) => {
          const connection = connectionMap.get(user.id);

          // ❌ remove if already connected
          if (connection?.status === 'ACCEPTED') return false;

          // ❌ remove if already following
          if (followedIds.includes(user.id)) return false;

          return true;
        })
        .map(async (user) => {
          const connection = connectionMap.get(user.id);

          const followersCount = await this.followRepository.count({
            where: { following: { id: user.id } },
          });

          return {
            ...user,
            isFollowing: followedIds.includes(user.id),
            followersCount,
            connectionStatus: connection?.status || null,
            isSender: connection?.isSender || false,
          };
        }),
    );
  }

  async getUsersByIds(userIds: string[]) {
    return this.userRepository.find({
      where: {
        id: In(userIds),
      },
      select: ['id', 'firstName', 'lastName', 'headline', 'profilePicture'],
    });
  }

  async getNetworkOverview(currentUserId: string) {
    const connections = await this.connectionRepository.count({
      where: [
        {
          sender: { id: currentUserId },
          status: ConnectionStatus.ACCEPTED,
        },
        {
          receiver: { id: currentUserId },
          status: ConnectionStatus.ACCEPTED,
        },
      ],
    });

    const following = await this.followRepository.count({
      where: { follower: { id: currentUserId } },
    });

    const invitesSent = await this.connectionRepository.count({
      where: {
        sender: { id: currentUserId },
        status: ConnectionStatus.PENDING,
      },
    });

    return {
      connections,
      following,
      invitesSent,
    };
  }
}
