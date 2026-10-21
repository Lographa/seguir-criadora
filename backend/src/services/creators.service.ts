import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Creator } from '../entities/creator.entity';

const SEED_CREATOR = { id: 'creator-1', name: 'Ana Criadora' };

@Injectable()
export class CreatorsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CreatorsService.name);

  constructor(
    @InjectRepository(Creator)
    private readonly creatorsRepository: Repository<Creator>,
  ) {}

  /** Cadastra a criadora inicial, se ela ainda não existir. */
  async onApplicationBootstrap(): Promise<void> {
    const exists = await this.creatorsRepository.existsBy({ id: SEED_CREATOR.id });
    if (exists) return;

    await this.creatorsRepository.save(this.creatorsRepository.create(SEED_CREATOR));
    this.logger.log(`Criadora "${SEED_CREATOR.name}" (${SEED_CREATOR.id}) cadastrada.`);
  }

  async findOneOrFail(id: string): Promise<Creator> {
    const creator = await this.creatorsRepository.findOneBy({ id });
    if (!creator) {
      throw new NotFoundException(`Criadora "${id}" não encontrada`);
    }
    return creator;
  }
}
