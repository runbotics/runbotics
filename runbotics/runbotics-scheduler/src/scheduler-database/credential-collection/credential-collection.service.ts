import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCredentialCollectionDto } from './dto/create-credential-collection.dto';
import { UpdateCredentialCollectionDto } from './dto/update-credential-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccessType,
    CredentialCollection,
} from './credential-collection.entity';
import { Repository } from 'typeorm';
import {
    CredentialCollectionUser,
    PrivilegeType,
} from '../credential-collection-user/credential-collection-user.entity';
import { UserService } from '#/database/user/user.service';
import { IUser, Tenant } from 'runbotics-common';

@Injectable()
export class CredentialCollectionService {
    private readonly logger = new Logger(CredentialCollectionService.name);

    constructor(
        @InjectRepository(CredentialCollection)
        private readonly credentialCollectionRepository: Repository<CredentialCollection>,
        @InjectRepository(CredentialCollectionUser)
        private readonly credentialCollectionUserRepository: Repository<CredentialCollectionUser>,
        private readonly userService: UserService,
    ) {}

    async create(
        createCredentialCollectionDto: CreateCredentialCollectionDto,
        user: IUser,
    ) {
        this.logger.debug('createCredentialCollectionDto', JSON.stringify(createCredentialCollectionDto, null, 2));
        const tenantId = user.tenantId;
        const {
            name,
            description,
            accessType,
            color,
            sharedWith,
        } = createCredentialCollectionDto;

        const credentialCollection = await this.credentialCollectionRepository.save(
            {
                name,
                description,
                accessType,
                color,
                createdBy: user,
                updatedBy: user,
                tenantId,
                credentialCollectionUser: [],
            }
        )
            .catch(
                async (error) => {
                    const isNameTaken = Boolean(await this.findOneByCriteria(user.tenantId, { name, createdById: user.id }));

                    if (isNameTaken) {
                        throw new BadRequestException(`Credential collection with name "${name}" already exists`);
                    }

                    throw new BadRequestException(error.message);
                }
            );

        if (accessType === AccessType.PRIVATE) {
            const credentialCollectionCreator =
                this.credentialCollectionUserRepository.create({
                    credentialCollectionId: credentialCollection.id,
                    userId: user.id,
                });

            credentialCollection.credentialCollectionUser.push(
                credentialCollectionCreator
            );
            this.logger.debug('Creating private credential collection', JSON.stringify(credentialCollection, null, 2));
            return this.credentialCollectionRepository.save(
                credentialCollection
            );
        }

        if (sharedWith && sharedWith.length > 0) {
            const credentialCollectionUserArray =
                await this.getCollectionUserArrayWithPrivileges(
                    sharedWith,
                    credentialCollection,
                    user,
                    tenantId,
                );

            credentialCollection.credentialCollectionUser =
                credentialCollectionUserArray;
        }
        this.logger.debug('Creating group credential collection', JSON.stringify(credentialCollection, null, 2));
        return this.credentialCollectionRepository.save(credentialCollection);
    }

    async findAll(user: IUser) {
        const collections = await this.credentialCollectionRepository.find({
            where: {
                tenantId: user.tenantId,
                credentialCollectionUser: {
                    userId: user.id,
                },
            },
        });

        if (collections.length === 0) {
            throw new NotFoundException('Could not find any credential collections');
        }

        return collections;
    }

    async findOne(id: string, user: IUser) {
        const collection = await this.credentialCollectionRepository.findOne({
            where: {
                id,
                tenantId: user.tenantId,
                credentialCollectionUser: {
                    userId: user.id,
                },
            },
        });

        if (!collection) {
            throw new NotFoundException('Could not find credential collection wit id: ' + id);
        }

        return collection;
    }

    async findOneByCriteria(tenantId: string, criteria: Partial<CredentialCollection>) {
        const collection = await this.credentialCollectionRepository.findOne({
            where: {
                tenantId,
                ...criteria
            },
        });

        if (!collection) {
            throw new NotFoundException('Could not find credential collection with given criteria');
        }

        return collection;
    }

    async update(
        id: string,
        updateCredentialCollectionDto: UpdateCredentialCollectionDto,
        user: IUser,
    ) {
        const { sharedWith, ...dto } = updateCredentialCollectionDto;
        const { tenantId } = user;

        if (dto.accessType !== AccessType.GROUP) {
            return this.credentialCollectionRepository.update(id, dto);
        }

        const credentialCollection =
            await this.credentialCollectionRepository.findOne({
                where: { id, tenantId },
            });

        const credentialCollectionUserArray =
            await this.getCollectionUserArrayWithPrivileges(
                sharedWith,
                credentialCollection,
                user,
                tenantId
            );

        // credentialCollection.credentialCollectionUser =
            // credentialCollectionUserArray;
        const credentialToUpdate = this.credentialCollectionRepository.create({
            ...credentialCollection,
            ...dto,
            id,
        });

        return this.credentialCollectionRepository
            .save(credentialToUpdate)
            .catch((error) => {
                throw new BadRequestException(error.message);
            });
    }

    remove(id: string) {
        return this.credentialCollectionRepository.delete(id);
    }

    private async getCollectionUserArrayWithPrivileges(
        sharedWith: UpdateCredentialCollectionDto['sharedWith'],
        credentialCollection: CredentialCollection,
        user: IUser,
        tenantId: Tenant['id'],
    ) {
        const userEmails = sharedWith
            .filter((item) => item.login !== user.login)
            .map((item) => item.login);

        const grantAccessUsers = await this.userService.findAllByLogins(
            userEmails,
            tenantId
        );

        const credentialCollectionCreator =
            this.credentialCollectionUserRepository.create({
                credentialCollectionId: credentialCollection.id,
                userId: user.id,
            });

        const credentialCollectionUserArray = grantAccessUsers.map(
            (grantedUser) => {
                const privilegeType =
                    sharedWith.find((item) => item.login === grantedUser.login)
                        ?.privilegeType ?? PrivilegeType.READ;

                return this.credentialCollectionUserRepository.create({
                    credentialCollectionId: credentialCollection.id,
                    userId: grantedUser.id,
                    privilegeType,
                });
            }
        );

        return [...credentialCollectionUserArray, credentialCollectionCreator];
    }
}
