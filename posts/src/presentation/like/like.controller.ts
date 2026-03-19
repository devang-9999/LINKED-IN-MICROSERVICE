/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LikeService } from '../../application/like/like.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt.gaurd';
import { CreatePostLikeDto } from 'src/application/like/dto/post-like.dto';

@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  toggleLike(@Body() dto: CreatePostLikeDto, @Req() req: any) {
    return this.likeService.toggleLike(req.user.userId, dto.postId);
  }

  @Get(':postId')
  getLikes(@Param('postId') postId: string, @Req() req: any) {
    return this.likeService.getPostLikes(postId, req.user.userId);
  }
}
