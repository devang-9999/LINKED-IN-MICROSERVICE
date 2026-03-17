/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { AddSkillDto } from 'src/application/profile/dto/skills/add-skill.dto';

import { SkillsService } from 'src/application/profile/services/skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  addSkill(@Req() req: any, @Body() dto: AddSkillDto) {
    return this.skillsService.addSkill(req.user.sub, dto);
  }

  @Get()
  getSkills(@Req() req: any) {
    return this.skillsService.getUserSkills(req.user.sub);
  }

  @Delete(':skillId')
  removeSkill(@Req() req: any, @Param('skillId') skillId: string) {
    return this.skillsService.removeSkill(req.user.sub, skillId);
  }
}
