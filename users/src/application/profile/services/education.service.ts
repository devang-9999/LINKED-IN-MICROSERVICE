import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Education } from 'src/domain/profile/entities/education.entity';
import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

import { CreateEducationDto } from '../dto/education/create-education.dto';
import { UpdateEducationDto } from '../dto/education/update-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,

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

  async create(userId: string, dto: CreateEducationDto) {
    const id = await this.getUserId(userId);

    const education = this.educationRepo.create({
      ...dto,
      user: { id } as User,
    });

    const saved = await this.educationRepo.save(education);

    await this.outboxRepo.save({
      aggregateType: 'education',
      aggregateId: saved.id,
      eventType: 'profile.education.added',
      payload: {
        userId: id,
        educationId: saved.id,
        school: saved.school,
      },
    });

    return saved;
  }

  async findAllByUser(userId: string) {
    const id = await this.getUserId(userId);

    return this.educationRepo.find({
      where: { user: { id } },
      order: { startDate: 'DESC' },
    });
  }

  async update(educationId: string, userId: string, dto: UpdateEducationDto) {
    const id = await this.getUserId(userId);

    const education = await this.educationRepo.findOne({
      where: { id: educationId },
      relations: ['user'],
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.user.id !== id) {
      throw new ForbiddenException('You cannot update this education');
    }

    Object.assign(education, dto);

    const updated = await this.educationRepo.save(education);

    await this.outboxRepo.save({
      aggregateType: 'education',
      aggregateId: updated.id,
      eventType: 'profile.education.updated',
      payload: {
        userId: id,
        educationId: updated.id,
      },
    });

    return updated;
  }

  async remove(educationId: string, userId: string) {
    const id = await this.getUserId(userId);

    const education = await this.educationRepo.findOne({
      where: { id: educationId },
      relations: ['user'],
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.user.id !== id) {
      throw new ForbiddenException('You cannot delete this education');
    }

    await this.educationRepo.remove(education);

    await this.outboxRepo.save({
      aggregateType: 'education',
      aggregateId: educationId,
      eventType: 'profile.education.deleted',
      payload: {
        userId: id,
        educationId,
      },
    });

    return { message: 'Education deleted successfully' };
  }
}
