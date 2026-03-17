import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Skill } from 'src/domain/profile/entities/skill.entity';
import { UserSkill } from 'src/domain/profile/entities/user-skill.entity';
import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';
import { AddSkillDto } from '../dto/skills/add-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,

    @InjectRepository(UserSkill)
    private readonly userSkillRepo: Repository<UserSkill>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
  ) {}

  private normalizeSkillName(name: string) {
    return name.trim().toLowerCase();
  }

  private async getUserId(userId: string): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.id;
  }

  async addSkill(userId: string, dto: AddSkillDto) {
    const id = await this.getUserId(userId);

    const normalized = this.normalizeSkillName(dto.name);

    let skill = await this.skillRepo.findOne({
      where: { name: normalized },
    });

    if (!skill) {
      skill = this.skillRepo.create({ name: normalized });
      skill = await this.skillRepo.save(skill);
    }

    const existing = await this.userSkillRepo.findOne({
      where: {
        user: { id },
        skill: { id: skill.id },
      },
    });

    if (existing) {
      throw new ConflictException('Skill already added');
    }

    const userSkill = this.userSkillRepo.create({
      user: { id } as User,
      skill,
    });

    const saved = await this.userSkillRepo.save(userSkill);

    await this.outboxRepo.save({
      aggregateType: 'skill',
      aggregateId: skill.id,
      eventType: 'profile.skill.added',
      payload: {
        userId: id,
        skillId: skill.id,
        skillName: skill.name,
      },
    });

    return saved;
  }

  async getUserSkills(userId: string) {
    const id = await this.getUserId(userId);

    return this.userSkillRepo.find({
      where: { user: { id } },
      relations: ['skill'],
      order: { skill: { name: 'ASC' } },
    });
  }

  async removeSkill(userId: string, skillId: string) {
    const id = await this.getUserId(userId);

    const userSkill = await this.userSkillRepo.findOne({
      where: {
        user: { id },
        skill: { id: skillId },
      },
      relations: ['skill'],
    });

    if (!userSkill) {
      throw new NotFoundException('Skill not found for user');
    }

    await this.userSkillRepo.remove(userSkill);

    await this.outboxRepo.save({
      aggregateType: 'skill',
      aggregateId: skillId,
      eventType: 'profile.skill.removed',
      payload: {
        userId: id,
        skillId,
      },
    });

    return { message: 'Skill removed successfully' };
  }
}
