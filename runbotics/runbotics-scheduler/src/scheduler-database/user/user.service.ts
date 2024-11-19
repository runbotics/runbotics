import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { BasicUserDto, FeatureKey, Role, UserDto } from 'runbotics-common';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authority } from '../authority/authority.entity';
import { Logger } from '#/utils/logger';
import { TenantService } from '../tenant/tenant.service';
import { Tenant } from '../tenant/tenant.entity';
import { isTenantAdmin } from '#/utils/authority.utils';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Authority)
        private readonly authorityRepository: Repository<Authority>,
        private readonly tenantService: TenantService
    ) {}

    findAll() {
        return this.userRepository.find();
    }

    findAllActivatedByTenant(tenantId: string) {
        return this.userRepository
            .findBy({ tenantId, activated: true })
            .then((users) => users.map(this.mapToUserDto));
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

    async update(userDto: UpdateUserDto, id: number, executor: User) {
        const { roles, tenantId, ...partialUser } = userDto;

        this.checkUpdateAllowedRole(executor, roles);
        const tenantRelation = await this.getTenantRelation(tenantId);

        const authority = await (async () =>
            roles
                ? await this.authorityRepository
                      .findOneBy({ name: roles[0] }) // compatibility with old multiple roles
                      .then((auth) => ({ authorities: [auth] }))
                : {})();

        const updatedUser = await this.userRepository
            .findOneByOrFail({
                id,
                ...(isTenantAdmin(executor) && { tenantId: executor.tenantId }),
            })
            .then((user) => ({
                ...user,
                ...partialUser,
                ...authority,
                ...(tenantRelation && { ...tenantRelation }),
                lastModifiedBy: executor.email,
            }))
            .catch(() => {
                this.logger.error('Cannot find user with id: ', id);
                throw new BadRequestException('User not found', 'NotFound');
            });

        return this.userRepository.save(updatedUser).then(this.mapToUserDto);
    }

    async delete(id: number) {
        await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new BadRequestException('Cannot find user with provided id');
        });

        await this.userRepository.delete(id);
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
            imageUrl: user.imageUrl,
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

    private checkUpdateAllowedRole(user: User, roles: Role[]) {
        if (!roles) return;
        const TENANT_ALLOWED_ROLES = [
            Role.ROLE_USER,
            Role.ROLE_TENANT_ADMIN,
            Role.ROLE_EXTERNAL_USER,
        ];

        if (!isTenantAdmin(user) && !TENANT_ALLOWED_ROLES.includes(roles[0])) {
            throw new BadRequestException('Wrong role');
        }
    }

    private getTenantRelation(
        tenantId: string | null
    ): Promise<{ tenant: Tenant } | null> {
        return this.tenantService
            .getById(tenantId)
            .then((tenant) => (tenant ? { tenant } : null))
            .catch(() => {
                throw new BadRequestException('Wrong tenant id');
            });
    }
}
