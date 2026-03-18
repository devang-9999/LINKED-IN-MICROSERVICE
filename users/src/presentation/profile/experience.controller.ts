/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ExperienceService } from 'src/application/profile/services/experience.service';
import { CreateExperienceDto } from 'src/application/profile/dto/experience/create-experience.dto';
import { UpdateExperienceDto } from 'src/application/profile/dto/experience/update-experience.dto';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateExperienceDto) {
    return this.experienceService.create(req.user.userId, dto);
  }

  @Get()
  findMyExperience(@Req() req: any) {
    return this.experienceService.findAllByUser(req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.experienceService.remove(id, req.user.userId);
  }
}
