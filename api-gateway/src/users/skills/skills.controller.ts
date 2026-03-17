/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  Res,
} from '@nestjs/common';

import express from 'express';
import { SkillsService } from './skills.service';

@Controller('users/skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Post()
  async addSkill(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.addSkill(body, req.headers);
    return res.status(response.status).json(response.data);
  }

  @Get()
  async getSkills(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.getSkills(req.headers);
    return res.status(response.status).json(response.data);
  }

  @Delete(':skillId')
  async removeSkill(
    @Param('skillId') skillId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.removeSkill(skillId, req.headers);

    return res.status(response.status).json(response.data);
  }
}
