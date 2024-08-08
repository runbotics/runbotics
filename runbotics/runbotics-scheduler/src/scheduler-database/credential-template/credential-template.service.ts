import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CredentialTemplate } from './credential-template.entity';
import { InjectRepository } from '@nestjs/typeorm';

const relations = ['attributes'];

@Injectable()
export class CredentialTemplateService {
  private readonly logger: Logger = new Logger(CredentialTemplateService.name);

  constructor(
    @InjectRepository(CredentialTemplate)
    private readonly templateRepo: Repository<CredentialTemplate>,
  ) { }

  async findOneById(id: string): Promise<CredentialTemplate> {
    const template = await this.templateRepo.findOne({ where: { id }, relations });

    if (!template) {
      throw new NotFoundException(`Could not find template with id ${id}`);
    }

    return template;
  }

  async findAll(): Promise<CredentialTemplate[]> {
    const templates = await this.templateRepo.find({ relations });

    if (templates.length === 0) {
      throw new NotFoundException('Could not find any templates');
    }

    return templates;
  }
}
