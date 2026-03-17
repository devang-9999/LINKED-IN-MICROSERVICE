import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Experience } from 'src/domain/profile/entities/experience.entity';
import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

import { CreateExperienceDto } from '../dto/experience/create-experience.dto';
import { UpdateExperienceDto } from '../dto/experience/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
  ) {}

  private async getUserId(userId: string): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.id;
  }

  async create(userId: string, dto: CreateExperienceDto) {
    const id = await this.getUserId(userId);

    const experience = this.experienceRepo.create({
      ...dto,
      user: { id } as User,
    });

    const saved = await this.experienceRepo.save(experience);

    await this.outboxRepo.save({
      aggregateType: 'experience',
      aggregateId: saved.id,
      eventType: 'profile.experience.added',
      payload: {
        userId: id,
        experienceId: saved.id,
        company: saved.company,
      },
    });

    return saved;
  }

  async findAllByUser(userId: string) {
    const id = await this.getUserId(userId);

    return this.experienceRepo.find({
      where: { user: { id } },
      order: { startDate: 'DESC' },
    });
  }

  async update(experienceId: string, userId: string, dto: UpdateExperienceDto) {
    const id = await this.getUserId(userId);

    const experience = await this.experienceRepo.findOne({
      where: { id: experienceId },
      relations: ['user'],
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.user.id !== id) {
      throw new ForbiddenException('You cannot update this experience');
    }

    Object.assign(experience, dto);

    const updated = await this.experienceRepo.save(experience);

    await this.outboxRepo.save({
      aggregateType: 'experience',
      aggregateId: updated.id,
      eventType: 'profile.experience.updated',
      payload: {
        userId: id,
        experienceId: updated.id,
      },
    });

    return updated;
  }

  async remove(experienceId: string, userId: string) {
    const id = await this.getUserId(userId);

    const experience = await this.experienceRepo.findOne({
      where: { id: experienceId },
      relations: ['user'],
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    if (experience.user.id !== id) {
      throw new ForbiddenException('You cannot delete this experience');
    }

    await this.experienceRepo.remove(experience);

    await this.outboxRepo.save({
      aggregateType: 'experience',
      aggregateId: experienceId,
      eventType: 'profile.experience.deleted',
      payload: {
        userId: id,
        experienceId,
      },
    });

    return { message: 'Experience deleted successfully' };
  }
}
