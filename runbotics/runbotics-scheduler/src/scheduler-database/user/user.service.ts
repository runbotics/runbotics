import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { BasicUserDto, FeatureKey, Role, UserDto } from 'runbotics-common';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';

// const relations = [];

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findAll() {
        return this.userRepository.find();
    }

    findAllByRole(role: Role) {
        return this.userRepository.find({
            where: {
                authorities: {
                    name: role,
                },
            },
        });
    }

    findAllByEmails(emails: string[], tenantId: string) {
        return this.userRepository.find({
            where: {
                tenantId,
                email: In(emails),
            },
        });
    }

    async findAllByPageWithSpecs(specs: Specs<User>, paging: Paging) {
        const options: FindManyOptions<User> = {
            ...paging,
            ...specs,
        };

        const page = await getPage(this.userRepository, options);

        return {
            ...page,
            content: page.content.map(this.mapToUserDto),
        };
    }

    findById(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    hasFeatureKey(user: User, featureKey: FeatureKey) {
        const userKeys = user.authorities
            .flatMap((auth) => auth.featureKeys)
            .map((featureKey) => featureKey.name);

        return userKeys.includes(featureKey);
    }

    mapToBasicUserDto(user: User): BasicUserDto {
        return {
            id: user.id,
            email: user.email,
        };
    }

    mapToUserDto(user: User): UserDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            langKey: user.langKey,
            activated: user.activated,
            createdBy: user.createdBy,
            createdDate: user.createdDate,
            lastModifiedBy: user.lastModifiedBy,
            lastModifiedDate: user.lastModifiedDate,
            tenant: {
                id: user.tenant.id,
                name: user.tenant.name,
            },
            featureKeys: user.authorities
                .flatMap((auth) => auth.featureKeys)
                .map((featureKey) => featureKey.name),
            roles: user.authorities.map((auth) => auth.name),
        };
    }
}