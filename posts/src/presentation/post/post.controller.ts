/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from '../../application/post/post.service';
import { CreatePostDto } from '../../application/post/dto/create-post.dto';
import { UpdatePostDto } from '../../application/post/dto/update-post.dto';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt.gaurd';
import { multerOptions } from 'src/infrastructure/config/multer/multer.configuration';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;

    if (file) {
      dto.mediaUrl = `/uploads/${file.filename}`;
      dto.mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    return this.postService.create({
      ...dto,
      userId,
    });
  }

  @Get()
  findAll(@Req() req: any, @Query('page') page = 1) {
    return this.postService.findAll(req.user.userId, Number(page));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.postService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Req() req: any) {
    return this.postService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.postService.remove(id, req.user.userId);
  }
}
