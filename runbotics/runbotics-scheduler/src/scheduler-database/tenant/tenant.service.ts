import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import dayjs from 'dayjs';

import { User } from '#/scheduler-database/user/user.entity';
import { Logger } from '#/utils/logger';

import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantInviteCode } from './tenant-invite-code.entity';
import { TenantInviteCodeDto } from './dto/invite-code.dto';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';
import { EmailTriggerWhitelistItem } from '../email-trigger-whitelist-item/email-trigger-whitelist-item.entity';

import { LicenseService } from '../license/license.service';
import { Role } from 'runbotics-common';
import { Authority } from '#/scheduler-database/authority/authority.entity';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

const relations = ['createdByUser', 'emailTriggerWhitelist'];

@Injectable()
export class TenantService {
    private readonly logger = new Logger(TenantService.name);

    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
        private readonly licenseService: LicenseService,
        @InjectRepository(TenantInviteCode)
        private readonly inviteCodeRepository: Repository<TenantInviteCode>,
        @InjectRepository(EmailTriggerWhitelistItem)
        private readonly emailTriggerWhitelistItem: Repository<EmailTriggerWhitelistItem>,
        private readonly jwtService: JwtService,
    ) {
    }

    getById(id: string) {
        return this.tenantRepository.findOne({ where: { id }, relations });
    }

    getAll() {
        return this.tenantRepository.find({ relations });
    }

    async getAllByPageWithSpecs(specs: Specs<Tenant>, paging: Paging) {
        const options: FindManyOptions<Tenant> = {
            ...paging,
            ...specs,
            relations,
        };

        const page = await getPage(this.tenantRepository, options);

        const contentWithLicenses = await Promise.all(
            page.content.map(async (tenant) => {
                return {
                    ...tenant,
                    createdByUser: {
                        id: tenant.createdByUser.id,
                        email: tenant.createdByUser.email,
                    },

                    activeLicenses:
                        await this.licenseService.countLicensesByTenant(
                            tenant.id,
                        ),
                };
            }),
        );

        return {
            ...page,
            content: contentWithLicenses,
        };
    }

    async create(tenantDto: CreateTenantDto, requester: User): Promise<Tenant> {
        const tenantByName = await this.tenantRepository.findOneBy({
            name: tenantDto.name,
        });
        if (tenantByName)
            throw new BadRequestException('Name already exist', 'NameExist');

        const newTenant = new Tenant();
        newTenant.name = tenantDto.name;
        newTenant.createdBy = requester.id;
        newTenant.lastModifiedBy = requester.email;

        return this.tenantRepository.save(newTenant);
    }

    async update(
        tenantDto: UpdateTenantDto,
        id: string,
        requester: User,
    ): Promise<Tenant> {
        const tenant = await this.tenantRepository
            .findOneByOrFail({ id })
            .catch(() => {
                this.logger.error('Cannot find tenant with id: ', id);
                throw new BadRequestException('Tenant not found', 'NotFound');
            });

        if (tenantDto.name) {
            const tenantByName = await this.tenantRepository.findOneBy({
                name: tenantDto.name,
            });
            if (tenantByName)
                throw new BadRequestException(
                    'Name already exist',
                    'NameExist',
                );

            tenant.name = tenantDto.name;
            tenant.lastModifiedBy = requester.email;
        }

        if (tenantDto.emailTriggerWhitelist) {
            await this.emailTriggerWhitelistItem.delete({ tenantId: id });

            const emailTriggerWhitelist = tenantDto.emailTriggerWhitelist.map(
                (whitelistItem) => {
                    const item = new EmailTriggerWhitelistItem();
                    item.tenantId = id;
                    item.whitelistItem = whitelistItem;
                    return item;
                },
            );

            tenant.emailTriggerWhitelist = emailTriggerWhitelist;
            tenant.lastModifiedBy = requester.email;
        }

        await this.tenantRepository.save(tenant);

        return this.tenantRepository.findOne({ where: { id }, relations });
    }

    async validateInviteCode(inviteCodeDto: TenantInviteCodeDto) {
        const inviteCode = await this.inviteCodeRepository
            .findOneOrFail({
                where: {
                    inviteId: inviteCodeDto.inviteCode,
                    expirationDate: MoreThanOrEqual(new Date()),
                },
                relations: ['tenant'],
            })
            .catch(() => {
                throw new BadRequestException(
                    'Invite code not valid or expired',
                );
            });

        return { tenantName: inviteCode.tenant.name };
    }

    getActiveInviteCodeByTenantId(
        tenantId: string,
    ): Promise<TenantInviteCodeDto | null> {
        return this.inviteCodeRepository
            .findOneBy({
                tenantId,
                expirationDate: MoreThanOrEqual(new Date()),
            })
            .then((inviteCode) =>
                inviteCode ? { inviteCode: inviteCode.inviteId } : null,
            );
    }

    async createInviteCodeByTenantId(tenantId: string) {
        const tenant = await this.tenantRepository
            .findOneByOrFail({ id: tenantId })
            .catch(() => {
                throw new NotFoundException(
                    'Cannot find tenant with id: ',
                    tenantId,
                );
            });

        await this.inviteCodeRepository
            .findBy({
                tenantId: tenant.id,
                expirationDate: LessThan(new Date()),
            })
            .then((codes) => {
                if (codes.length > 0) {
                    this.inviteCodeRepository.delete([
                        ...codes.map((code) => code.inviteId),
                    ]);
                }
            });

        const newInviteCode = {
            tenantId: tenant.id,
            creationDate: dayjs(),
            expirationDate: dayjs().add(7, 'days'),
        };

        return this.inviteCodeRepository
            .save(newInviteCode)
            .then((inviteCode) => ({ inviteCode: inviteCode.inviteId }));
    }

    async delete(tenantId: string) {
        await this.tenantRepository
            .findOneByOrFail({ id: tenantId })
            .catch(() => {
                throw new BadRequestException(
                    'Cannot find tenant with provided id',
                    'BadTenantID',
                );
            });

        await this.tenantRepository.delete(tenantId).catch(() => {
            throw new BadRequestException(
                'Cannot delete tenant related to other resources',
                'RelatedTenant',
            );
        });
    }

    async getServiceToken(tenantId: string) {
        const transactionResult = await this.tenantRepository.manager.transaction(async manager => {
            const tenant = await manager.findOne(Tenant, { where: { id: tenantId } });
            let serviceUser = await manager.findOne(User, {
                where: {
                    tenantId, authorities: {
                        name: Role.ROLE_SERVICE_ACCOUNT,
                    },
                },
            });
            if (!serviceUser) {
                const serviceAccountAuthority = await manager.findOneByOrFail(
                    Authority,
                    { name: Role.ROLE_SERVICE_ACCOUNT },
                );
                serviceUser = await manager.save(User, {
                    tenantId: tenantId,
                    email: `service_${tenant.name}@service`,
                    authorities: [serviceAccountAuthority],
                    activated: true,
                    createdBy: 'system',
                    lastModifiedBy: 'system',
                    hasBeenActivated: true,
                    passwordHash: await bcrypt.hash(this.generateSecurePassword(14), 10),
                    activationKey: randomUUID().slice(20),
                });
            }

            const newToken = await this.createServiceToken(serviceUser);

            const updatedTenant = await manager.save(Tenant, { ...tenant, serviceTokenExpDate: dayjs().add(1, 'year').toDate() });
            return { token: newToken, serviceTokenExpDate: updatedTenant.serviceTokenExpDate };
        });

        if (!transactionResult) {
            throw new InternalServerErrorException(`Could not create service token for tenant ${tenantId}`);
        }
        return transactionResult;

    }

    private generateSecurePassword(length: number) {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';
        const special = '!@#$%^&*()-_=+[]{};:,.<>?';
        const allChars = upper + lower + digits + special;

        const randomChar = (chars) => {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return chars[array[0] % chars.length];
        };

        const password = [
            randomChar(upper),
            randomChar(digits),
            randomChar(special),
        ];

        for (let i = password.length; i < length; i++) {
            password.push(randomChar(allChars));
        }

        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [password[i], password[j]] = [password[j], password[i]];
        }

        return password.join('');
    }

    private async createServiceToken(user: User) {

        const payload = { sub: user.email, auth: user.authorities.map(authority => authority.name).at(0) };

        return this.jwtService.sign(payload, {
            expiresIn: '1y',
            algorithm: 'HS512',
            noTimestamp: true,
        });
    }
}
