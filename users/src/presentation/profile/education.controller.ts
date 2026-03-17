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
} from '@nestjs/common';

import { EducationService } from 'src/application/profile/services/education.service';
import { CreateEducationDto } from 'src/application/profile/dto/education/create-education.dto';
import { UpdateEducationDto } from 'src/application/profile/dto/education/update-education.dto';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateEducationDto) {
    return this.educationService.create(req.user.sub, dto);
  }

  @Get()
  findMyEducation(@Req() req: any) {
    return this.educationService.findAllByUser(req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.educationService.remove(id, req.user.sub);
  }
}
