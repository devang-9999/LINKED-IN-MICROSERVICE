import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,
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

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.findUser(userId);

    Object.assign(user, dto);

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
}
