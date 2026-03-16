import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Experience } from 'src/domain/profile/entities/experience.entity';
import { User } from 'src/domain/profile/entities/user.entity';

import { CreateExperienceDto } from '../dto/experience/create-experience.dto';
import { UpdateExperienceDto } from '../dto/experience/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

    return this.experienceRepo.save(experience);
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

    return this.experienceRepo.save(experience);
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

    return { message: 'Experience deleted successfully' };
  }
}
