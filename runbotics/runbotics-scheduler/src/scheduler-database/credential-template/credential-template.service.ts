import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialTemplateDto, createCredentialTemplateSchema } from './dto/create-credential-template.dto';
import { UpdateCredentialTemplateDto } from './dto/update-credential-template.dto';
import { Repository } from 'typeorm';
import { CredentialTemplate } from './credential-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialTemplateAttributeService } from '../credential-template-attribute/credential-template-attribute.service';
import { AuthRequest } from '#/types';

const relations = ['attributes'];

@Injectable()
export class CredentialTemplateService {
  constructor (
    @InjectRepository(CredentialTemplate)
    private readonly templateRepo: Repository<CredentialTemplate>,
    private readonly templateAttributeService: CredentialTemplateAttributeService,
  ) {}

  async create(templateDto: CreateCredentialTemplateDto) {
    const parsedTemplateDto = createCredentialTemplateSchema.safeParse(templateDto);

    if (!parsedTemplateDto.success) {
      throw new BadRequestException(parsedTemplateDto.error.format());
    }

    const template = await this.templateRepo.create({
      ...parsedTemplateDto.data,
    });

    return this.templateRepo.save(template)
      .then((savedTemplate) => savedTemplate)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  findAll() {
    return this.templateRepo.find({
      relations,
    });
  }

  findAllByTenantIdOrTenantIdNull(tenantId: string) {
    return this.templateRepo.find({
      relations,
      where: {
        tenantId: tenantId || null,
      },
    });
  }

  async findOneById(id: string) {
    const template = await this.templateRepo.findOne({
      relations,
      where: {
        id,
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async updateById(id: string, templateDto: UpdateCredentialTemplateDto) {
    const template = await this.findOneById(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const templateToUpdate = {
      ...template,
      ...templateDto,
    };

    return this.templateRepo.update({ id }, templateToUpdate);
  }

  async removeById(id: string) {
    const template = await this.findOneById(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.templateRepo.remove(template);
  }
}
