import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Attribute } from './attribute.entity';
import { AuthRequest } from '#/types';
import { Logger } from '#/utils/logger';
import { SecretService } from '../secret/secret.service';

const relations = ['tenant', 'createdBy', 'updatedBy'];

@Injectable()
export class AttributeService {
  private readonly logger = new Logger(AttributeService.name);

  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    private readonly secretService: SecretService,
  ) { }

  async create(createAttributeDto: CreateAttributeDto, request: AuthRequest): Promise<Attribute> {
    const { user: { tenantId, id: userId } } = request;

    const encryptedValue = this.secretService.encrypt(createAttributeDto.value, tenantId);

    const secretEntity = {
      ...encryptedValue,
      value: encryptedValue,
      tenantId,
      createdById: userId,
      updatedById: userId,
    };

    const secret = await this.secretService.save(secretEntity);
    const secretId = secret.id;

    const attribute = {
      ...createAttributeDto,
      secretId: secretId,
      tenantId,
      createdById: userId,
      updatedById: userId,
      masked: createAttributeDto.masked || true,
    };

    return this.attributeRepository.manager.save(Attribute, attribute);
  }

  async findAll(): Promise<Attribute[]> {
    const attributes = await this.attributeRepository.find({
      relations,
    });

    return attributes;
  }

  async findOneById(id: string): Promise<Attribute> {
    const attribute = this.attributeRepository.findOne({
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

  async findByIdAndTenantId(id: string, tenantId: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
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

  async update(id: string, updateAttributeDto: UpdateAttributeDto, request: AuthRequest): Promise<UpdateResult> {
    const { user: { id: userId, tenantId } } = request;
    const attribute = await this.findByIdAndTenantId(id, tenantId);

    if (!attribute) {
      throw new NotFoundException(`Attribute with id: ${id} not found`);
    }

    const newSecret = await this.secretService.encrypt(updateAttributeDto.value, tenantId);
    await this.secretService.update({ ...newSecret, id: attribute.secretId });

    const { value: _value, ...updateAttributeFields } = updateAttributeDto;
    const updatedAttribute = { ...updateAttributeFields, updatedById: userId, secretId: newSecret.id };
    return this.attributeRepository.update(id, updatedAttribute);
  }

  async delete(id: string, request: AuthRequest): Promise<DeleteResult> {
    const { user: { tenantId } } = request;
    const attribute = await this.findByIdAndTenantId(id, tenantId);

    if (!attribute) {
      throw new NotFoundException(`Attribute with id: ${id} not found`);
    }

    return this.secretService.deleteById(attribute.secretId);
  }
}