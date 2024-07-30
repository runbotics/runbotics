import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCredentialTemplateDto, createCredentialTemplateSchema } from './dto/create-credential-template.dto';
import { UpdateCredentialTemplateDto } from './dto/update-credential-template.dto';
import { Repository } from 'typeorm';
import { CredentialTemplate } from './credential-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialTemplateAttributeService } from '../credential-template-attribute/credential-template-attribute.service';
import { AuthRequest } from '#/types';
import { CredentialTemplateAttribute } from '../credential-template-attribute/credential-template-attribute.entity';

const relations = ['attributes'];

@Injectable()
export class CredentialTemplateService {
  private readonly logger: Logger = new Logger(CredentialTemplateService.name);

  constructor(
    @InjectRepository(CredentialTemplate)
    private readonly templateRepo: Repository<CredentialTemplate>,
    private readonly templateAttributeService: CredentialTemplateAttributeService,
  ) { }

  async create(templateDto: CreateCredentialTemplateDto, request: AuthRequest) {
    const template = new CredentialTemplate();

    const attributes = templateDto.attributes.map(attributeDto => {
      const attribute = new CredentialTemplateAttribute();
      attribute.templateId = template.id;
      attribute.name = attributeDto.name;
      attribute.description = attributeDto.description;
      return attribute;
    });

    template.name = templateDto.name;
    template.description = templateDto.description;
    template.attributes = attributes;
    template.tenantId = templateDto.isForTenantOnly ? request.user.tenantId : null;

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

    return template;
  }

  async findOneByIdAndTenantId(id: string, tenantId: string) {
    return this.templateRepo.findOne({
      relations,
      where: {
        id,
        tenantId: null
      }
    });
  }

  async updateById(id: string, templateDto: UpdateCredentialTemplateDto, request: AuthRequest) {
    const template = await this.findOneById(id);

    const attributesToUpdate = templateDto.attributes.map(attributeDto => {
      const attribute = new CredentialTemplateAttribute();
      attribute.templateId = template.id;
      attribute.name = attributeDto.name;
      attribute.description = attributeDto.description;
      return attribute;
    });

    const templateToUpdate = new CredentialTemplate();
    templateToUpdate.id = template.id;
    templateToUpdate.name = templateDto.name;
    templateToUpdate.description = templateDto.description;
    templateToUpdate.tenantId = templateDto.isForTenantOnly ? request.user.tenantId : null;
    templateToUpdate.attributes = attributesToUpdate;

    return this.templateRepo.save(templateToUpdate)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  async removeById(id: string) {
    const template = await this.findOneById(id);

    return this.templateRepo.remove(template);
  }
}
