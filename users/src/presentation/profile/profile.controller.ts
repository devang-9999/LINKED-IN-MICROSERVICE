/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  Query,
} from '@nestjs/common';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { ProfileService } from 'src/application/profile/services/profile.service';
import { UpdateUserDto } from 'src/application/profile/dto/update-user.dto';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';
import { multerOptions } from 'src/infrastructure/config/multer/multer.configuration';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @UseGuards(JwtAuthGuard)
  @Get('suggestions')
  getSuggestions(@Req() req: any) {
    return this.profileService.getSuggestions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.profileService.getMyProfile(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.profileService.getPublicProfile(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPicture', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateUserDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPicture?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.userId;

    const profilePicture = files?.profilePicture?.[0]?.filename;
    const coverPicture = files?.coverPicture?.[0]?.filename;

    return this.profileService.updateProfile(
      userId,
      dto,
      profilePicture,
      coverPicture,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch('profile-picture')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.profileService.updateProfilePicture(
      req.user.userId,
      file.filename,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch('cover-picture')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateCoverPicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.profileService.updateCoverPicture(
      req.user.userId,
      file.filename,
    );
  }

  @Get('bulk')
  getUsersBulk(@Query('ids') ids: string) {
    const userIds = ids.split(',');
    return this.profileService.getUsersByIds(userIds);
  }
}
