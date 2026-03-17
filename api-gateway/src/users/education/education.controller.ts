/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Res,
} from '@nestjs/common';

import express from 'express';
import { EducationService } from './education.service';

@Controller('users/education')
export class EducationController {
  constructor(private readonly service: EducationService) {}

  @Post()
  async create(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.create(body, req.headers);
    return res.status(response.status).json(response.data);
  }

  @Get()
  async getAll(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.getAll(req.headers);
    return res.status(response.status).json(response.data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.update(id, body, req.headers);
    return res.status(response.status).json(response.data);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.remove(id, req.headers);
    return res.status(response.status).json(response.data);
  }
}
