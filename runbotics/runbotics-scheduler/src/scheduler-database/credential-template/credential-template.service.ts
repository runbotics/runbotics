import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { CredentialTemplate } from './credential-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionBlacklistService } from '../action-blacklist/action-blacklist.service';

const relations = ['attributes'];

@Injectable()
export class CredentialTemplateService {
  private readonly logger: Logger = new Logger(CredentialTemplateService.name);

  constructor(
    @InjectRepository(CredentialTemplate)
    private readonly templateRepo: Repository<CredentialTemplate>,
    private readonly actionBlackListService: ActionBlacklistService,
  ) { }

  async findOneById(id: string): Promise<CredentialTemplate> {
    const template = await this.templateRepo.findOne({ where: { id }, relations });

    if (!template) {
      throw new NotFoundException(`Could not find template with id ${id}`);
    }

    return template;
  }

  async findAll(): Promise<CredentialTemplate[]> {
    const blacklistEntity = await this.actionBlackListService.findCurrent();
    const blacklistGroups = blacklistEntity.actionGroups || [];

    const templates = await this.templateRepo.find({ 
      relations, 
      where: {
        name: Not(In(blacklistGroups)),
      } 
    });

    if (templates.length === 0) {
      throw new NotFoundException('Could not find any templates');
    }

    return templates;
  }
}
