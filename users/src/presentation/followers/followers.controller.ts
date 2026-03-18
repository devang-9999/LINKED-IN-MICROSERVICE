/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { FollowersService } from 'src/application/followers/services/followers.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':userId')
  follow(@Req() req: any, @Param('userId') userId: string) {
    return this.followersService.followUser(req.user.userId, userId);
  }

  @Delete(':userId')
  unfollow(@Req() req: any, @Param('userId') userId: string) {
    return this.followersService.unfollowUser(req.user.userId, userId);
  }

  @Get(':userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followersService.getFollowers(userId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followersService.getFollowing(userId);
  }
}
