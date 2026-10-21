import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetCreatorQueryDto } from '../dto/get-creator-query.dto';
import { CreatorsService } from '../services/creators.service';
import { FollowersService } from '../services/followers.service';

@Controller('creators')
export class CreatorsController {
  constructor(
    private readonly creatorsService: CreatorsService,
    private readonly followersService: FollowersService,
  ) {}

  // GET /creators/:id?userId=...
  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: GetCreatorQueryDto) {
    const creator = await this.creatorsService.findOneOrFail(id);
    const followersCount = await this.followersService.countFollowers(creator.id);
    const isFollowing = query.userId
      ? await this.followersService.isFollowing(creator.id, query.userId)
      : false;

    return { id: creator.id, name: creator.name, followersCount, isFollowing };
  }
}
