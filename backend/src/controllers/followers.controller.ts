import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FollowCreatorDto } from '../dto/follow-creator.dto';
import { UnfollowParamsDto } from '../dto/unfollow-params.dto';
import { FollowersService } from '../services/followers.service';

@Controller('creators/:creatorId/followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  // POST /creators/:creatorId/followers   body: { "userId": "..." }
  @Post()
  async follow(@Param('creatorId') creatorId: string, @Body() body: FollowCreatorDto) {
    const follower = await this.followersService.follow(creatorId, body.userId);
    return {
      creatorId: follower.creatorId,
      userId: follower.userId,
      createdAt: follower.createdAt,
    };
  }

  // GET /creators/:creatorId/followers/count
  @Get('count')
  async count(@Param('creatorId') creatorId: string) {
    const followersCount = await this.followersService.countByCreator(creatorId);
    return { creatorId, followersCount };
  }

  // DELETE /creators/:creatorId/followers/:userId
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@Param() params: UnfollowParamsDto): Promise<void> {
    await this.followersService.unfollow(params.creatorId, params.userId);
  }
}
