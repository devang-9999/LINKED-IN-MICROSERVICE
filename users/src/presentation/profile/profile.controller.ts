/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Patch, Param, Body, Req } from '@nestjs/common';

import { ProfileService } from 'src/application/profile/services/profile.service';
import { UpdateUserDto } from 'src/application/profile/dto/update-user.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.profileService.getMyProfile(req.user.sub);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.profileService.getPublicProfile(id);
  }

  @Patch()
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.profileService.updateProfile(req.user.sub, dto);
  }

  @Patch('profile-picture')
  updateProfilePicture(@Req() req: any, @Body('filename') filename: string) {
    return this.profileService.updateProfilePicture(req.user.sub, filename);
  }

  @Patch('cover-picture')
  updateCoverPicture(@Req() req: any, @Body('filename') filename: string) {
    return this.profileService.updateCoverPicture(req.user.sub, filename);
  }
}
