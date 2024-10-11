import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { Repository } from 'typeorm';
import { IUser } from 'runbotics-common';
import { CredentialTemplateService } from '../credential-template/credential-template.service';
import { SecretService } from '../secret/secret.service';
import { Secret } from '../secret/secret.entity';
import { UpdateAttributeDto } from '../credential-attribute/dto/update-attribute.dto';
import { CredentialCollectionService } from '../credential-collection/credential-collection.service';
import { ProcessCredential } from '../process-credential/process-credential.entity';
import { MailService } from '#/mail/mail.service';
import { CredentialNotifyMailArgs, CredentialOperationType } from './credential.utils';

const relations = ['attributes'];

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    private readonly templateService: CredentialTemplateService,
    private readonly secretService: SecretService,
    private readonly collectionService: CredentialCollectionService,
    private readonly mailService: MailService,
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
          name: attribute.name,
          description: attribute.description,
          templateId: attribute.templateId,
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
      .then((credential) => {
        this.notifyCredentialCollectionOwner({
          executor: user,
          collectionId: credential.collectionId,
          credentialName: credential.name,
          operationType: CredentialOperationType.CREATE,
      });
      })
      .catch(async (error) => {
        await this.validateName(credentialDto.name, collectionId, tenantId);
        throw new BadRequestException(error.message);
      });
  }

  async findAllAccessible(user: IUser) {
    const accessibleCollections = await this.collectionService.findAllAccessibleWithUser(user);

    if (accessibleCollections.length === 0) {
      return [];
    }

    const credentials = accessibleCollections.flatMap((collection) => collection.credentials)
      .map(credential => ({
        ...credential,
        createdBy: {
          id: credential.createdBy.id,
          login: credential.createdBy.login,
        },
        collection: {
          id: credential.collection.id,
          name: credential.collection.name
        }
      }));

    if (!credentials.some((credential) => Boolean(credential))) {
      return [];
    }

    return credentials;
  }

  async findAllAccessibleByTemplateAndProcess(templateName: string, processId: string, user: IUser) {
    const accessibleCollections = await this.collectionService.findAllAccessibleWithUser(user);
    if (!accessibleCollections.length) {
      return [];
    }

    const accessible = accessibleCollections.map(collection => collection.id);

    const credentials = await this.credentialRepo
      .createQueryBuilder('credentials')
      .innerJoinAndSelect('credentials.createdBy', 'user')
      .innerJoinAndSelect(
          'credentials.collection',
          'collection',
          'collection.id IN (:...accessible)',
          { accessible }
      )
      .innerJoinAndSelect(
          'credentials.template',
          'template',
          'template.name = :templateName',
          { templateName }
      )
      .leftJoin(
          ProcessCredential,
          'pc',
          'pc.credentialId = credentials.id'
      )
      .where('pc.processId != :processId OR pc.processId IS NULL', {
          processId,
      })
      .getMany()
      .then(credentials =>
          credentials.map(credential => ({
              ...credential,
              createdBy: {
                  id: credential.createdBy.id,
                  login: credential.createdBy.login,
              },
              collection: {
                  id: credential.collection.id,
                  name: credential.collection.name,
              },
          }))
      );

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

    return credentials;
  }

  async findOneAccessibleById(id: string, tenantId: string) {
    const result = await this.credentialRepo.findOne({
      where: {
        id,
        tenantId,
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
    const credential = await this.findOneAccessibleById(id, user.tenantId);

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

    const credentialOldName =
        credential.name !== credentialDto.name ? credential.name : undefined;

    return this.credentialRepo
        .save(credentialToUpdate)
        .then((credential) => {
            this.notifyCredentialCollectionOwner({
                executor: user,
                collectionId: credential.collectionId,
                credentialName: credential.name,
                credentialOldName,
                operationType: CredentialOperationType.EDIT,
            });
        })
        .catch(async (error) => {
            await this.validateName(
                credentialToUpdate.name,
                credential.collectionId,
                credential.tenantId
            );
            throw new BadRequestException(error.message);
        });
  }

  async removeById(id: string, user: IUser) {
    const credential = await this.findOneAccessibleById(id, user.tenantId);
    return this.credentialRepo.remove(credential).then((credential) => {
        this.notifyCredentialCollectionOwner({
            executor: user,
            collectionId: credential.collectionId,
            credentialName: credential.name,
            operationType: CredentialOperationType.DELETE,
        });
    });
  }

  async updateAttribute(id: string, attributeName: string, attributeDto: UpdateAttributeDto, user: IUser) {
    const credential = await this.findOneAccessibleById(id, user.tenantId);

    if (!credential) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    const attribute = credential.attributes.find((attr) => attr.name === attributeName);

    const encryptedValue =
      this.secretService.encrypt(attributeDto.value, user.tenantId);
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

    return this.credentialRepo.save(updatedCredential).then((credential) => {
        this.notifyCredentialCollectionOwner({
            executor: user,
            collectionId: credential.collectionId,
            credentialName: credential.name,
            operationType: CredentialOperationType.CHANGE_ATTRIBUTE,
            attributeName,
        });
    });
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

  private async notifyCredentialCollectionOwner(
    params: CredentialNotifyMailArgs
  ) {
      const { executor, collectionId, credentialName, credentialOldName, operationType } =
          params;

      const collection = await this.collectionService.findOneByCriteria(
          executor.tenantId,
          { id: collectionId }
      );
      const collectionCreator = collection.createdBy;

      if (collectionCreator.id !== executor.id) {
          this.mailService.sendCredentialChangeNotificationMail({
              editorEmail: executor.email,
              collectionCreatorEmail: collectionCreator.email,
              collectionName: collection.name,
              credentialName,
              credentialOldName,
              operationType,
              ...(operationType ===
                  CredentialOperationType.CHANGE_ATTRIBUTE && {
                  attributeName: params.attributeName,
              }),
          });
      }
  }
}
