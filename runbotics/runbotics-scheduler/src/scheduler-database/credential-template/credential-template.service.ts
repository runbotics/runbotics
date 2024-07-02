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
  constructor(
    @InjectRepository(CredentialTemplate)
    private readonly templateRepo: Repository<CredentialTemplate>,
    private readonly templateAttributeService: CredentialTemplateAttributeService,
  ) { }

  async create(templateDto: CreateCredentialTemplateDto, request: AuthRequest) {
    const { isForTenantOnly, attributes, ...dto } = templateDto;
    const template = await this.templateRepo.create({
      ...dto,
      tenantId: isForTenantOnly ? request.user.tenantId : null,
    });

    const savedTemplate = await this.templateRepo.save(template)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });

    await Promise.all(
      attributes.map(attribute => this.templateAttributeService.create({ ...attribute, templateId: savedTemplate.id }))
    )
      .catch((error) => {
        throw new BadRequestException(error.message);
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

  async findOneByIdAndTenantId(id: string, tenantId: string) {
    return this.templateRepo.findOne({
      relations,
      where: {
        id,
        tenantId
      }
    });
  }

  async updateById(id: string, templateDto: UpdateCredentialTemplateDto, request: AuthRequest) {
    const template = await this.findOneById(id);

    const { isForTenantOnly: _, attributes: attributesToUpdate, ...templateToUpdate } = {
      ...template,
      ...templateDto,
      tenantId: templateDto?.isForTenantOnly ? request.user.tenantId : null,
    };

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const updatingPromises = attributesToUpdate.map((attribute) => {
      return this.templateAttributeService.updateByNameAndTemplateId(attribute.name, id, attribute);
    });

    const updatingResponses = await Promise.all(updatingPromises);

    return this.templateRepo.update({ id }, templateToUpdate)
      .then((updatedTemplate) => ({ ...updatedTemplate, attributes: updatingResponses }))
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  async removeById(id: string) {
    const template = await this.findOneById(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.templateRepo.remove(template);
  }
}
