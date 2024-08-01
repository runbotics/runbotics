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
      .catch(async (error) => {
        await this.validateName(templateDto.name);
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
      throw new NotFoundException(`Could not find template with id ${id}`);
    }

    return template;
  }

  async findOneByIdAndTenantId(id: string, tenantId: string) {
    const template = this.templateRepo.findOne({
      relations,
      where: {
        id,
        tenantId,
      }
    });

    if (!template) {
      throw new NotFoundException(`Could not find template with id ${id}`);
    }

    return template;
  }

  async updateById(id: string, templateDto: UpdateCredentialTemplateDto) {
    const template = await this.findOneById(id);

    // const templateAttributes = this.templateAttributeService.findByTemplateId(template.id);

    const attributesToUpdate = templateDto.attributes.map(attributeDto => {
      const attribute = new CredentialTemplateAttribute();
      attribute.templateId = id;
      attribute.name = attributeDto.name;
      attribute.description = attributeDto.description;
      return attribute;
    });

    const templateToUpdate = new CredentialTemplate();
    templateToUpdate.id = id;
    templateToUpdate.name = templateDto.name;
    templateToUpdate.description = templateDto.description;
    templateToUpdate.attributes = attributesToUpdate;

    await this.templateAttributeService.removeByTemplateId(id);
    this.logger.debug('templateToUpdate', JSON.stringify(templateToUpdate, null, 2));
    return this.templateRepo.save(templateToUpdate)
      .catch(async (error) => {
        await this.validateName(templateToUpdate.name);
        throw new BadRequestException(error.message);
      });
  }

  async removeById(id: string) {
    const template = await this.findOneById(id);

    return this.templateRepo.remove(template);
  }

  private async checkIsNameTaken(name: string) {
    const result = await this.templateRepo.findOne({
      where: {
        name,
      }
    });

    return Boolean(result);
  }

  private async validateName(name: string) {
    const isNameTaken = await this.checkIsNameTaken(name);

    if (isNameTaken) {
      throw new BadRequestException('Name already taken. One user cannot have two templates with the same name.');
    }
  }
}
