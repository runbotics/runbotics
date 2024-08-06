import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CredentialAttribute } from './credential-attribute.entity';
import { AuthRequest } from '#/types';
import { Logger } from '#/utils/logger';
import { SecretService } from '../secret/secret.service';
import { Secret } from '../secret/secret.entity';
import { CredentialService } from '../credential/credential.service';
import { CredentialTemplateService } from '../credential-template/credential-template.service';

const relations = ['tenant', 'secret'];

@Injectable()
export class CredentialAttributeService {
  private readonly logger = new Logger(CredentialAttributeService.name);

  constructor(
    @InjectRepository(CredentialAttribute)
    private readonly attributeRepo: Repository<CredentialAttribute>,
    private readonly secretService: SecretService,
    private readonly templateService: CredentialTemplateService,
    private readonly credentialService: CredentialService
  ) { }

  async create(attributeDto: CreateAttributeDto, request: AuthRequest) {
    const { user: { tenantId } } = request;

    const credential = await this.credentialService.findById(attributeDto.credentialId, tenantId);
    const template = await this.templateService.findOneById(credential.templateId);

    if (!template.attributes.map(attribute => attribute.name).includes(attributeDto.name)) {
      throw new BadRequestException(`Attribute name: ${attributeDto.name} not found in template: ${template.name}`);
    }

    if (credential.attributes.some(attribute => attribute.name === attributeDto.name)) {
      throw new BadRequestException(`Attribute with name: ${attributeDto.name} already exists in template: ${template.name}`);
    }

    const encryptedValue = this.secretService.encrypt(attributeDto.value, tenantId);
    const secretEntity: Secret = {
      ...encryptedValue,
      tenantId,
    };
    const secret = await this.secretService.save(secretEntity)
      .catch((error) => {
        throw new BadRequestException(`Failed to save secret: ${error.message}`);
      });

    const secretId = secret.id;
    const attribute = this.attributeRepo.create({
      ...attributeDto,
      secretId: secretId,
      tenantId,
      masked: attributeDto.masked || true,
    });

    return this.attributeRepo.save(attribute)
      .catch((error) => {
        throw new BadRequestException(`Failed to save attribute: ${error.message}`);
      });
  }

  async findAll(): Promise<CredentialAttribute[]> {
    const attributes = await this.attributeRepo.find({
      relations,
    });

    if (attributes.length === 0) {
      throw new NotFoundException('No attributes found');
    }

    return attributes;
  }

  async findOneById(id: string) {
    const attribute = await this.attributeRepo.findOne({
      where: {
        id,
      },
      relations,
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with id: ${id} not found`);
    }

    return attribute;
  }

  async findByIdAndTenantId(id: string, tenantId: string): Promise<CredentialAttribute> {
    const attribute = await this.attributeRepo.findOne({
      where: {
        tenantId,
        id,
      },
      relations,
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with id: ${id} not found`);
    }

    return attribute;
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto, request: AuthRequest) {
    const { user: { tenantId } } = request;
    const { value: _value, ...updateAttributeFields } = updateAttributeDto;

    const attribute = await this.findOneById(id);
    const newSecret = await this.secretService.encrypt(updateAttributeDto.value, tenantId);

    const secretToUpdate = { ...newSecret, id: attribute.secretId };
    const attributeToUpdate = await this.attributeRepo.create({
      ...attribute,
      ...updateAttributeFields,
      secret: secretToUpdate,
      secretId: attribute.secretId,
      id
    });

    return this.attributeRepo.save(attributeToUpdate);
  }

  async delete(id: string, request: AuthRequest): Promise<DeleteResult> {
    const attribute = await this.findOneById(id);

    if (!attribute) {
      throw new NotFoundException(`Attribute with id: ${id} not found`);
    }

    return this.secretService.deleteById(attribute.secretId);
  }
}