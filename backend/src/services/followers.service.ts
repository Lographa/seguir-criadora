import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Follower } from '../entities/follower.entity';
import { CreatorsService } from './creators.service';

function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) return false;
  const code = (error as any).code ?? (error as any).driverError?.code;
  return code === 'SQLITE_CONSTRAINT_UNIQUE';
}

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private readonly followersRepository: Repository<Follower>,
    private readonly creatorsService: CreatorsService,
  ) {}

  async follow(creatorId: string, userId: string): Promise<Follower> {
    await this.creatorsService.findOneOrFail(creatorId);

    const alreadyFollowing = await this.followersRepository.existsBy({ creatorId, userId });
    if (alreadyFollowing) throw this.alreadyFollowing();

    try {
      return await this.followersRepository.save(
        this.followersRepository.create({ creatorId, userId }),
      );
    } catch (error) {
      // Duas requisições simultâneas podem passar pela checagem acima;
      // a restrição única do banco é a garantia final.
      if (isUniqueViolation(error)) throw this.alreadyFollowing();
      throw error;
    }
  }

  async unfollow(creatorId: string, userId: string): Promise<void> {
    await this.creatorsService.findOneOrFail(creatorId);

    const result = await this.followersRepository.delete({ creatorId, userId });
    if (!result.affected) {
      throw new NotFoundException(
        `O usuário "${userId}" não segue a criadora "${creatorId}"`,
      );
    }
  }

  async countByCreator(creatorId: string): Promise<number> {
    await this.creatorsService.findOneOrFail(creatorId);
    return this.followersRepository.countBy({ creatorId });
  }

  /** Uso interno: assume que a criadora já foi validada pelo chamador. */
  countFollowers(creatorId: string): Promise<number> {
    return this.followersRepository.countBy({ creatorId });
  }

  isFollowing(creatorId: string, userId: string): Promise<boolean> {
    return this.followersRepository.existsBy({ creatorId, userId });
  }

  private alreadyFollowing(): ConflictException {
    return new ConflictException('O usuário já segue esta criadora');
  }
}
