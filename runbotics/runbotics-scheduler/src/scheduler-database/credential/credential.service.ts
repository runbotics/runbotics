import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { In, Repository } from 'typeorm';
import { IUser } from 'runbotics-common';
import { CredentialTemplateService } from '../credential-template/credential-template.service';
import { SecretService } from '../secret/secret.service';
import { Secret } from '../secret/secret.entity';
import { UpdateAttributeDto } from '../credential-attribute/dto/update-attribute.dto';
import { CredentialCollectionService } from '../credential-collection/credential-collection.service';

const relations = ['attributes'];

@Injectable()
export class CredentialService {
  private readonly logger = new Logger(CredentialService.name);

  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    private readonly templateService: CredentialTemplateService,
    private readonly secretService: SecretService,
    private readonly collectionService: CredentialCollectionService,
  ) { }

  async create(credentialDto: CreateCredentialDto, collectionId: string, user: IUser) {
    const template = await this.templateService.findOneById(credentialDto.templateId);

    if (!template) {
      throw new NotFoundException(`Could not find template with id ${credentialDto.templateId}`);
    }

    const tenantId = user.tenantId;

    const attributes = await Promise.all(
      template.attributes.map(async (attribute) => {
        const encryptedValue = this.secretService.encrypt('', tenantId);
        const secretEntity: Secret = {
          ...encryptedValue,
          tenantId,
        };

        const secret = await this.secretService.save(secretEntity)
          .catch((error) => {
            throw new BadRequestException(`Failed to save secret: ${error.message}`);
          });

        const secretId = secret.id;

        return {
          ...attribute,
          secretId: secretId,
          tenantId,
          masked: true,
        };
      }));

    const credential = this.credentialRepo.create({
      ...credentialDto,
      createdById: user.id,
      updatedById: user.id,
      tenantId,
      collectionId,
      attributes,
    });

    return this.credentialRepo.save(credential)
      .catch(async (error) => {
        await this.validateName(credentialDto.name, collectionId, tenantId);
        throw new BadRequestException(error.message);
      });
  }

  async findAllAccessible(tenantId: string, user: IUser) {
    const accessibleCollections = await this.collectionService.findAllAccessible(user);

    if (accessibleCollections.length === 0) {
      throw new NotFoundException('Could not find any accessible collections');
    }

    const credentials = accessibleCollections.map((collection) => collection.credentials).flat();

    if (!credentials.some((credential) => Boolean(credential))) {
      throw new NotFoundException('Could not find any credentials in any of the accessible collections');
    }

    return credentials;
  }

  async findByCriteria(tenantId: string, criteria: Partial<Credential>) {
    return this.credentialRepo.find({
      where: {
        tenantId,
        ...criteria
      },
      relations
    });
  }

  async findAllAccessibleByCollectionId(user: IUser, collectionId: string) {
    const collection = await this.collectionService.findOneAccessibleById(collectionId, user);

    if (!collection) {
      throw new NotFoundException(`Could not find collection with id ${collection}`);
    }

    const credentials = await this.findByCriteria(user.tenantId, { collectionId });

    if (credentials.length === 0) {
      throw new NotFoundException(`Could not find credentials for collection with id ${collectionId}`);
    }

    return credentials;
  }

  async findOneAccessibleById(id: string) {
    const result = await this.credentialRepo.findOne({
      where: {
        id
      },
      relations
    });

    if (!result) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    return result;
  }

  async findById(id: string, tenantId: string) {
    const credential = await this.credentialRepo.findOne({
      where: {
        id,
        tenantId
      },
      relations
    });

    if (!credential) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    return credential;
  }

  async updateById(id: string, credentialDto: UpdateCredentialDto, user: IUser) {
    const credential = await this.findOneAccessibleById(id);

    if (!credential) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    const credentialToUpdate = this.credentialRepo.create({
      ...credential,
      ...credentialDto,
      id,
      updatedById: user.id,
      tenantId: credential.tenantId,
    });

    return this.credentialRepo.save(credentialToUpdate)
      .catch(async (error) => {
        await this.validateName(credentialToUpdate.name, credential.collectionId, credential.tenantId);
        throw new BadRequestException(error.message);
      });
  }

  async removeById(id: string) {
    const credential = await this.findOneAccessibleById(id);
    return this.credentialRepo.remove(credential);
  }

  async updateAttribute(id: string, attributeName: string, attributeDto: UpdateAttributeDto, user: IUser) {
    const credential = await this.findOneAccessibleById(id);

    if (!credential) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    const attribute = credential.attributes.find((attr) => attr.name === attributeName);

    const encryptedValue = this.secretService.encrypt('', user.tenantId);
    const secretEntity: Secret = {
      ...encryptedValue,
      tenantId: user.tenantId,
      id: attribute.secretId,
    };

    const secret = await this.secretService.save(secretEntity)
      .catch((error) => {
        throw new BadRequestException(`Failed to update secret: ${error.message}`);
      });

    if (!attribute) {
      throw new NotFoundException(`Could not find attribute with name ${attributeName}`);
    }

    const updatedAttribute = {
      ...attribute,
      ...attributeDto,
      secret,
    };

    const updatedAttributes = credential.attributes.map((item) => {
      if (item.name === attributeName) {
        return updatedAttribute;
      }

      return item;
    });

    const updatedCredential = this.credentialRepo.create({
      ...credential,
      attributes: updatedAttributes,
      updatedById: user.id,
    });

    return this.credentialRepo.save(updatedCredential);
  }

    async checkIsNameTaken(name: string, collectionId: string, tenantId: string) {
    const result = await this.credentialRepo.findOne({
      where: {
        name,
        collectionId,
        tenantId,
      }
    });

    return Boolean(result);
  }

  private async validateName(name: string, collectionId: string, tenantId: string) {
    const isNameTaken = await this.checkIsNameTaken(name, collectionId, tenantId);

    if (isNameTaken) {
      throw new BadRequestException('Name already taken. There cannot be two credentials with the same name in the same collection');
    }
  }
}
