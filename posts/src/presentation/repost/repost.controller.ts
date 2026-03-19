/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';

import { RepostService } from '../../application/repost/repost.service';
import { CreateRepostDto } from '../../application/repost/dto/create-repost.dto';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('reposts')
export class RepostController {
  constructor(private readonly repostService: RepostService) {}

  @Post(':postId')
  create(
    @Param('postId') postId: string,
    @Req() req: any,
    @Body() dto: CreateRepostDto,
  ) {
    return this.repostService.create({
      userId: req.user.userId,
      postId,
      message: dto.message,
    });
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.repostService.findAll(Number(page), Number(limit));
  }

  @Get('post/:postId')
  findByPost(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.repostService.findByPost(postId, Number(page), Number(limit));
  }
  @Delete(':postId')
  remove(@Param('postId') postId: string, @Req() req: any) {
    return this.repostService.remove(req.user.userId, postId);
  }
}
