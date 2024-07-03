import { Inject, Injectable } from '@nestjs/common';
import { CreateCredentialCollectionDto } from './dto/create-credential-collection.dto';
import { UpdateCredentialCollectionDto } from './dto/update-credential-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccessType,
    CredentialCollection,
} from './credential-collection.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '#/database/user/user.entity';
import {
    CredentialCollectionUser,
    PrivilegeType,
} from '../credential-collection-user/credential-collection-user.entity';
import { UserService } from '#/database/user/user.service';
import { Tenant } from '#/database/tenant/tenant.entity';

@Injectable()
export class CredentialCollectionService {
    constructor(
        @InjectRepository(CredentialCollection)
        private readonly credentialCollectionRepository: Repository<CredentialCollection>,
        @InjectRepository(CredentialCollectionUser)
        private readonly credentialCollectionUserRepository: Repository<CredentialCollectionUser>,
        @Inject() private readonly userService: UserService
    ) {}

    async create(
        createCredentialCollectionDto: CreateCredentialCollectionDto,
        user: UserEntity
    ) {
        const { name, description, accessType, color, sharedWith } =
            createCredentialCollectionDto;
        const { tenantId, tenant } = user;

        const credentialCollection = this.credentialCollectionRepository.create(
            {
                name,
                description,
                accessType,
                color,
                createdBy: user,
                updatedBy: user,
                tenant,
            }
        );

        if (accessType === AccessType.PRIVATE) {
            const credentialCollectionCreator =
                this.credentialCollectionUserRepository.create({
                    credentialCollection,
                    user,
                });

            credentialCollection.credentialCollectionUser.push(
                credentialCollectionCreator
            );

            return this.credentialCollectionRepository.save(
                credentialCollection
            );
        }

        const credentialCollectionUserArray =
            await this.getCredentialCollectionUserArrayWithPrivileges(
                sharedWith,
                credentialCollection,
                user,
                tenantId
            );

        credentialCollection.credentialCollectionUser =
            credentialCollectionUserArray;

        return this.credentialCollectionRepository.save(credentialCollection);
    }

    findAll(user: UserEntity) {
        return this.credentialCollectionRepository.find({
            where: {
                tenantId: user.tenantId,
                credentialCollectionUser: {
                    userId: user.id,
                },
            },
        });
    }

    findOne(id: string, user: UserEntity) {
        return this.credentialCollectionRepository.findOne({
            where: {
                id,
                tenantId: user.tenantId,
                credentialCollectionUser: {
                    userId: user.id,
                },
            },
        });
    }

    async update(
        id: string,
        updateCredentialCollectionDto: UpdateCredentialCollectionDto,
        user: UserEntity
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
            await this.getCredentialCollectionUserArrayWithPrivileges(
                sharedWith,
                credentialCollection,
                user,
                tenantId
            );

        credentialCollection.credentialCollectionUser =
            credentialCollectionUserArray;

        return this.credentialCollectionRepository.update(id, {
            ...credentialCollection,
            ...dto,
        });
    }

    remove(id: string) {
        return this.credentialCollectionRepository.delete(id);
    }

    private async getCredentialCollectionUserArrayWithPrivileges(
        sharedWith: UpdateCredentialCollectionDto['sharedWith'],
        credentialCollection: CredentialCollection,
        user: UserEntity,
        tenantId: Tenant['id']
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
                credentialCollection,
                user,
            });

        const credentialCollectionUserArray = grantAccessUsers.map(
            (grantedUser) => {
                const privilegeType =
                    sharedWith.find((item) => item.login === grantedUser.login)
                        ?.privilegeType ?? PrivilegeType.READ;

                return this.credentialCollectionUserRepository.create({
                    credentialCollection,
                    user: grantedUser,
                    privilegeType,
                });
            }
        );

        return [...credentialCollectionUserArray, credentialCollectionCreator];
    }
}
