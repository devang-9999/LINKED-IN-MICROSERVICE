import { Module } from '@nestjs/common';

import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';

import { EducationController } from './education/education.controller';
import { EducationService } from './education/education.service';

import { ExperienceController } from './experience/experience.controller';
import { ExperienceService } from './experience/experience.service';
import { FollowersController } from './followers/follower.controller';
import { ConnectionsController } from './connections/connection.controller';
import { FollowersService } from './followers/follower.service';
import { ConnectionsService } from './connections/connection.service';
import { UploadProxyController } from './uploads/proxy.controller';

@Module({
  controllers: [
    ProfileController,

    SkillsController,

    EducationController,

    ExperienceController,

    FollowersController,

    ConnectionsController,

    UploadProxyController,
  ],

  providers: [
    ProfileService,

    SkillsService,

    EducationService,

    ExperienceService,

    FollowersService,

    ConnectionsService,
  ],
})
export class UsersModule {}
