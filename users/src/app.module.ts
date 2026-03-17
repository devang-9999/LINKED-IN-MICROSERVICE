import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTITIES
import { User } from './domain/profile/entities/user.entity';
import { Education } from './domain/profile/entities/education.entity';
import { Experience } from './domain/profile/entities/experience.entity';
import { Skill } from './domain/profile/entities/skill.entity';
import { UserSkill } from './domain/profile/entities/user-skill.entity';

import { Follow } from './domain/followers/entities/follow.entity';
import { Connection } from './domain/connections/entities/connection.entity';

import { OutboxEvent } from './infrastructure/outbox/outbox.entity';
import { InboxEvent } from './infrastructure/inbox/inbox.entity';

// DATABASE

// SERVICES
import { ProfileService } from './application/profile/services/profile.service';
import { EducationService } from './application/profile/services/education.service';
import { ExperienceService } from './application/profile/services/experience.service';
import { SkillsService } from './application/profile/services/skills.service';

import { FollowersService } from './application/followers/services/followers.service';

// CONTROLLERS
import { ProfileController } from './presentation/profile/profile.controller';
import { EducationController } from './presentation/profile/education.controller';
import { ExperienceController } from './presentation/profile/experience.controller';
import { SkillsController } from './presentation/profile/skills.controller';

import { FollowersController } from './presentation/followers/followers.controller';
import { ConnectionsController } from './presentation/connections/connections.controller';
import dataSource from './infrastructure/database/data-source/data-source';
import { ConnectionsService } from './application/connections/services/connection.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),

    TypeOrmModule.forFeature([
      User,
      Education,
      Experience,
      Skill,
      UserSkill,
      Follow,
      Connection,
      OutboxEvent,
      InboxEvent,
    ]),
  ],

  controllers: [
    ProfileController,
    EducationController,
    ExperienceController,
    SkillsController,
    FollowersController,
    ConnectionsController,
  ],

  providers: [
    ProfileService,
    EducationService,
    ExperienceService,
    SkillsService,
    FollowersService,
    ConnectionsService,
  ],
})
export class AppModule {}
