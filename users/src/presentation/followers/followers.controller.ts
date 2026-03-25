/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { FollowersService } from 'src/application/followers/services/followers.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  private getUserId(req: any): string {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return req.user.userId;
  }

  @Post(':userId')
  follow(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = this.getUserId(req);
    return this.followersService.followUser(currentUserId, userId);
  }

  @Delete(':userId')
  unfollow(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = this.getUserId(req);
    return this.followersService.unfollowUser(currentUserId, userId);
  }

  @Get('status/:userId')
  getFollowStatus(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = this.getUserId(req);
    return this.followersService.getFollowStatus(currentUserId, userId);
  }

  @Get('following/count')
  getFollowingCount(@Req() req: any) {
    const currentUserId = this.getUserId(req);
    return this.followersService.getFollowingCount(currentUserId);
  }

  @Get(':userId/count')
  getFollowersCount(@Param('userId') userId: string) {
    return this.followersService.getFollowersCount(userId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followersService.getFollowing(userId);
  }

  @Get(':userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followersService.getFollowers(userId);
  }
}
