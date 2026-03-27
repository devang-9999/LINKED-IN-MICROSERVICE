import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/profile/entities/user.entity';
import { Education } from './domain/profile/entities/education.entity';
import { Experience } from './domain/profile/entities/experience.entity';
import { Skill } from './domain/profile/entities/skill.entity';
import { UserSkill } from './domain/profile/entities/user-skill.entity';
import { Follow } from './domain/followers/entities/follow.entity';
import { Connection } from './domain/connections/entities/connection.entity';
import { OutboxEvent } from './infrastructure/outbox/outbox.entity';
import { InboxEvent } from './infrastructure/inbox/inbox.entity';
import { ProfileService } from './application/profile/services/profile.service';
import { EducationService } from './application/profile/services/education.service';
import { ExperienceService } from './application/profile/services/experience.service';
import { SkillsService } from './application/profile/services/skills.service';
import { FollowersService } from './application/followers/services/followers.service';
import { ProfileController } from './presentation/profile/profile.controller';
import { EducationController } from './presentation/profile/education.controller';
import { ExperienceController } from './presentation/profile/experience.controller';
import { SkillsController } from './presentation/profile/skills.controller';
import { FollowersController } from './presentation/followers/followers.controller';
import { ConnectionsController } from './presentation/connections/connections.controller';
import dataSource from './infrastructure/database/data-source/data-source';
import { ConnectionsService } from './application/connections/services/connection.service';
import { JwtModule } from './infrastructure/security/jwt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InboxProcessorDispatcher } from './cli/process';
import { OutboxRunner } from './cli/dispatch';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    ScheduleModule.forRoot(),
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
    JwtModule,
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
    OutboxRunner,
    InboxProcessorDispatcher,
  ],
})
export class AppModule {}
