import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, FindManyOptions, In, Not, Repository } from 'typeorm';
import { BasicUserDto, FeatureKey, PartialUserDto, Role, UserDto } from 'runbotics-common';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authority } from '../authority/authority.entity';
import { Logger } from '#/utils/logger';
import { TenantService } from '../tenant/tenant.service';
import { Tenant } from '../tenant/tenant.entity';
import { isAdmin, isTenantAdmin } from '#/utils/authority.utils';
import postgresError from '#/utils/postgresError';
import { DeleteUserDto } from './dto/delete-user.dto';
import { MailService } from '#/mail/mail.service';
import { MicrosoftSSOUserDto } from '#/auth/auth.service.types';
import bcrypt from 'bcryptjs';
import { generate } from 'generate-password';
import { ActivateUserDto } from './dto/activate-user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Authority)
        private readonly authorityRepository: Repository<Authority>,
        private readonly tenantService: TenantService,
        private readonly mailService: MailService,
        private readonly dataSource: DataSource,
    ) { }

    async createMicrosoftSSOUser(msUserAuthDto: MicrosoftSSOUserDto) {
        const user = new User();
        const randomPassword = generate({
            length: 24,
            numbers: true,
            symbols: true,
        });
        user.passwordHash = bcrypt.hashSync(randomPassword, 10);
        user.email = msUserAuthDto.email;
        user.langKey = msUserAuthDto.langKey;
        user.activated = true;
        user.hasBeenActivated = true;
        user.activationKey = generate({ length: 20 });
        user.createdBy = 'system';
        user.lastModifiedBy = 'system';

        const { id } = await this.userRepository.save(user);

        await this.dataSource
            .createQueryBuilder()
            .insert()
            .into('jhi_user_authority')
            .values({ user_id: id, authority_name: Role.ROLE_USER })
            .execute();

        return this.userRepository.findOneOrFail({
            where: { id },
            relations: ['authorities'],
        });
    }

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

    countByEmailsInTenant(emails: string[], tenantId: string) {
        return this.userRepository.countBy({
            tenantId,
            email: In(emails),
        });
    }

    findByEmailsNotTenantAdmin(emails: string[], tenantId: string) {
        return this.userRepository.findBy({
            tenantId,
            email: In(emails),
            authorities: {
                name: Not(Role.ROLE_TENANT_ADMIN)
            }
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

    async activate(activateDto: ActivateUserDto, id: number, executor: User) {
        const { roles, tenantId } = activateDto;

        if (!isAdmin(executor) && executor.tenantId !== tenantId) {
            throw new ForbiddenException();
        }

        this.checkUpdateAllowedRole(executor, roles);
        const tenantRelation = await this.getTenantRelation(tenantId);

        const authority = await (async () =>
            roles
                ? await this.authorityRepository
                    .findOneBy({ name: roles[0] }) // compatibility with old multiple roles
                    .then((auth) => ({ authorities: [auth] }))
                : {})();

        const user = await this.userRepository
            .findOneByOrFail({
                id,
                ...(!isAdmin(executor) && { tenantId: executor.tenantId }),
            })
            .catch((err) => {
                this.logger.error('Cannot find user with id: ', id, 'Error:', err);
                throw new BadRequestException('User not found', 'NotFound');
            });

        const updatedUserDto: PartialUserDto = {
            ...user,
            ...authority,
            ...(tenantRelation && { ...tenantRelation }),
            hasBeenActivated: true,
            activated: true,
            lastModifiedBy: executor.email,
        };

        const updatedUserEntity = await this.userRepository.save(updatedUserDto);

        const isFirstActivation = !user.hasBeenActivated;

        if (isFirstActivation) {
            this.mailService.sendUserAcceptMail(user, activateDto.message);
        }
        return this.mapToUserDto(updatedUserEntity);
    }

    async update(userDto: UpdateUserDto, id: number, executor: User) {
        const { roles, tenantId, ...partialUser } = userDto;

        if (!isAdmin(executor) && executor.tenantId !== tenantId) {
            throw new ForbiddenException();
        }

        this.checkUpdateAllowedRole(executor, roles);
        const tenantRelation = await this.getTenantRelation(tenantId);

        const authority = await (async () =>
            roles
                ? await this.authorityRepository
                    .findOneBy({ name: roles[0] }) // compatibility with old multiple roles
                    .then((auth) => ({ authorities: [auth] }))
                : {})();

        const user = await this.userRepository
            .findOneByOrFail({
                id,
                ...(!isAdmin(executor) && { tenantId: executor.tenantId }),
            })
            .catch(() => {
                this.logger.error('Cannot find user with id: ', id);
                throw new BadRequestException('User not found', 'NotFound');
            });

        const isFirstActivation = partialUser.activated && !user.hasBeenActivated;

        const updatedUser: PartialUserDto = {
            ...user,
            ...partialUser,
            ...authority,
            ...(tenantRelation && { ...tenantRelation }),
            ...(isFirstActivation && { hasBeenActivated: true }),
            lastModifiedBy: executor.email,
        };

        return this.userRepository.save(updatedUser).then(this.mapToUserDto);
    }

    async delete(id: number) {
        await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new BadRequestException('Cannot find user with provided id');
        });

        await this.userRepository.delete(id).catch((err) => {
            if (err.code === postgresError.foreign_key_violation) {
                throw new ConflictException('User has related resources');
            }

            throw new BadRequestException();
        });
    }

    async deleteInTenant(id: number, user: User, userDto: DeleteUserDto) {
        if (!isTenantAdmin(user)) {
            throw new ForbiddenException('You have no permission to decline users');
        }
        const userToDelete = await this.userRepository
            .findOneByOrFail({ id, tenantId: user.tenantId })
            .catch(() => {
                throw new NotFoundException();
            });
        if (userToDelete.hasBeenActivated) {
            throw new BadRequestException('User has been activated at least once');
        }

        await this.userRepository.delete(id);

        this.mailService.sendUserDeclineReasonMail(userToDelete, userDto);
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
            hasBeenActivated: user.hasBeenActivated,
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
