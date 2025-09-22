import { MsalSsoUserDto } from '#/auth/auth.service.types';
import { MailService } from '#/mail/mail.service';
import { isAdmin, isTenantAdmin } from '#/utils/authority.utils';
import { Logger } from '#/utils/logger';
import { getPage } from '#/utils/page/page';
import { Paging } from '#/utils/page/pageable.decorator';
import postgresError from '#/utils/postgresError';
import { Specs } from '#/utils/specification/specifiable.decorator';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { generate } from 'generate-password';
import { BasicUserDto, FeatureKey, getRolesAllowedInTenant, PartialUserDto, Role, UserDto } from 'runbotics-common';
import { DataSource, FindManyOptions, In, Not, Repository } from 'typeorm';
import { Authority } from '../authority/authority.entity';
import { Tenant } from '../tenant/tenant.entity';
import { TenantService } from '../tenant/tenant.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

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
    ) {
    }

    async addMsalSSOCredentialsToUser(user: User, msalSsoUserDto: MsalSsoUserDto) {
        user.microsoftTenantId = msalSsoUserDto.msTenantId;
        user.microsoftUserId = msalSsoUserDto.msObjectId;

        return await this.userRepository.save(user);
    }

    async createMsalSsoUser(msalSsoUserDto: MsalSsoUserDto) {
        const user = new User();
        const randomPassword = generate({
            length: 24,
            numbers: true,
            symbols: true,
        });
        user.passwordHash = bcrypt.hashSync(randomPassword, 10);
        user.email = msalSsoUserDto.email;
        user.langKey = msalSsoUserDto.langKey;
        user.activated = true;
        user.hasBeenActivated = true;
        user.activationKey = generate({ length: 20 });
        user.createdBy = 'system';
        user.lastModifiedBy = 'system';
        user.microsoftTenantId = msalSsoUserDto.msTenantId;
        user.microsoftUserId = msalSsoUserDto.msObjectId;

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
                name: Not(Role.ROLE_TENANT_ADMIN),
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
        return this.userRepository.findOne({ where: { id }, relations: { authorities: true, tenant: true } });
    }

    async findByEmailForAuth(email: string) {
        const result = await this.userRepository.findOne({
            where: { email },
            relations: { authorities: true, tenant: true },
        });
        const password = await this.userRepository.findOne({
           select: { email:true, id: true, passwordHash: true},
            where: { id: result.id },
        });
        return {
            ...result, 
            passwordHash: password.passwordHash,
            roles: result.authorities.map(authority => {
                return authority.name;
            }),
            featureKeys: result.authorities.map(authority => { return authority.featureKeys.map(featureKey => (featureKey.name)); }).flat(),
        };
    }

    findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    findByEmailFromToken(email: string) {
        return this.userRepository.findOne({ where: { email }, relations: { authorities: true, tenant: true, } });
    }

    async activate(activateDto: ActivateUserDto, id: number, executor: User) {
        const { roles, tenantId } = activateDto;

        this.checkTenantAccess(tenantId, executor);
        this.checkUpdateAllowedRole(executor, roles);

        const tenantRelation = await this.getTenantRelation(tenantId);
        const authority = await this.getAuthorityFromRoles(roles);
        const user = await this.getUserForExecutorOrFail(id, executor);

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

        this.checkTenantAccess(tenantId, executor);
        this.checkUpdateAllowedRole(executor, roles);

        const tenantRelation = await this.getTenantRelation(tenantId);
        const authority = await this.getAuthorityFromRoles(roles);
        const user = await this.getUserForExecutorOrFail(id, executor);

        const isFirstActivation = partialUser.activated && !user.hasBeenActivated;

        const updatedUser: PartialUserDto = {
            ...user,
            ...partialUser,
            ...authority,
            ...(tenantRelation && { ...tenantRelation }),
            ...(isFirstActivation && { hasBeenActivated: true }),
            lastModifiedBy: executor.email,
        };

        const remoteUpdatedUser = await this.userRepository.save(updatedUser);
        return this.mapToUserDto(remoteUpdatedUser);
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

    private checkTenantAccess(tenantId: string, actionExecutor: User) {
        if (!isAdmin(actionExecutor) && actionExecutor.tenantId !== tenantId) {
            throw new ForbiddenException();
        }
    }

    private async getUserForExecutorOrFail(userId: number, executor: User) {
        return await this.userRepository
            .findOneByOrFail({
                id: userId,
                ...(!isAdmin(executor) && { tenantId: executor.tenantId }),
            })
            .catch(() => {
                this.logger.error('Cannot find user with id: ', userId);
                throw new BadRequestException('User not found', 'NotFound');
            });
    }

    private async getAuthorityFromRoles(roles?: Role[]) {
        return await (async () =>
            roles
                ? await this.authorityRepository
                    .findOneBy({ name: roles[0] }) // compatibility with old multiple roles
                    .then((auth) => ({ authorities: [auth] }))
                : {})();
    }

    private checkUpdateAllowedRole(user: User, roles: Role[] | undefined) {
        if (!roles) return;

        const ROLES_ALLOWED_IN_TENANT = getRolesAllowedInTenant();

        if (!this.hasFeatureKey(user, FeatureKey.MANAGE_ALL_TENANTS) && !ROLES_ALLOWED_IN_TENANT.includes(roles[0])) {
            throw new BadRequestException('Wrong role');
        }
    }

    private getTenantRelation(
        tenantId: string | null,
    ): Promise<{ tenant: Tenant } | null> {
        return this.tenantService
            .getById(tenantId)
            .then((tenant) => (tenant ? { tenant } : null))
            .catch(() => {
                throw new BadRequestException('Wrong tenant id');
            });
    }

    public findAllByTenantIdAndRole(tenantId: string, role: Role) {
        return this.userRepository.find({
            where: {
                tenantId,
                authorities: {
                    name: role,
                },
            },
            relations: ['authorities'],
        });
    }

    public findAllByTenantId(tenantId: string) {
        return this.userRepository.find({
            where: {
                tenantId,
            },
            relations: ['authorities'],
        });
    }
}
