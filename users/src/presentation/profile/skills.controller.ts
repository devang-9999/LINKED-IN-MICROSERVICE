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
  UseGuards,
} from '@nestjs/common';

import { AddSkillDto } from 'src/application/profile/dto/skills/add-skill.dto';
import { SkillsService } from 'src/application/profile/services/skills.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  addSkill(@Req() req: any, @Body() dto: AddSkillDto) {
    return this.skillsService.addSkill(req.user.userId, dto);
  }

  @Get()
  getSkills(@Req() req: any) {
    return this.skillsService.getUserSkills(req.user.userId);
  }

  @Delete(':skillId')
  removeSkill(@Req() req: any, @Param('skillId') skillId: string) {
    return this.skillsService.removeSkill(req.user.userId, skillId);
  }
}
