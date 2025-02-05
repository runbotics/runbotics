import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { EmailTriggerWhitelistItem } from '../emial-trigger-whitelist-item/emial-trigger-whitelist-item.entity';

const relations = ['createdByUser', 'emailTriggerWhitelist'];

@Injectable()
export class TenantService {
    private readonly logger = new Logger(TenantService.name);

    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
        @InjectRepository(TenantInviteCode)
        private readonly inviteCodeRepository: Repository<TenantInviteCode>,
        @InjectRepository(EmailTriggerWhitelistItem)
        private readonly emailTriggerWhitelistItem: Repository<EmailTriggerWhitelistItem>
    ) {}

    getById(id: string) {
        return this.tenantRepository.findOneBy({ id });
    }

    getAll() {
        return this.tenantRepository.find();
    }

    async getAllByPageWithSpecs(specs: Specs<Tenant>, paging: Paging) {
        const options: FindManyOptions<Tenant> = {
            ...paging,
            ...specs,
            relations
        };

        const page = await getPage(this.tenantRepository, options);

        return {
            ...page,
            content: page.content.map(tenant => ({
                ...tenant,
                createdByUser: {
                    id: tenant.createdByUser.id,
                    email: tenant.createdByUser.email
                }
            })),
        };
    }

    async create(tenantDto: CreateTenantDto, requester: User): Promise<Tenant> {
        const tenantByName = await this.tenantRepository.findOneBy({ name: tenantDto.name });
        if (tenantByName) throw new BadRequestException('Name already exist', 'NameExist');


        const newTenant = new Tenant();
        newTenant.name = tenantDto.name;
        newTenant.createdBy = requester.id;
        newTenant.lastModifiedBy = requester.email;

        return this.tenantRepository.save(newTenant);
    }

    async update(
        tenantDto: UpdateTenantDto,
        id: string,
        requester: User
    ): Promise<Tenant> {
        const tenantByName = await this.tenantRepository.findOneBy({ name: tenantDto.name });
        if (tenantByName) throw new BadRequestException('Name already exist', 'NameExist');

        const updatedTenant = await this.tenantRepository
            .findOneByOrFail({ id })
            .then(tenant => ({
                ...tenant,
                name: tenantDto.name,
                lastModifiedBy: requester.email
            }))
            .then(async (tenant) => {
                if (!tenant.emailTriggerWhitelist) return tenant;

                await this.emailTriggerWhitelistItem.delete({ tenantId: id });

                const emailTriggerWhitelist = tenantDto.emailTriggerWhitelist
                    .map((whitelistItem) => {
                        const item = new EmailTriggerWhitelistItem();
                        item.tenantId = id;
                        item.whitelistItem = whitelistItem;
                        return item;
                    });

                return {
                    ...tenant,
                    emailTriggerWhitelist,
                };
            })
            .catch(() => {
                this.logger.error('Cannot find tenant with id: ', id);
                throw new BadRequestException('Tenant not found', 'NotFound');
            });

        return this.tenantRepository.save(updatedTenant);
    }

    async validateInviteCode(inviteCodeDto: TenantInviteCodeDto) {
        const inviteCode = await this.inviteCodeRepository.findOneOrFail({
            where: {
                inviteId: inviteCodeDto.inviteCode,
                expirationDate: MoreThanOrEqual(new Date())
            },
            relations: ['tenant']
        }).catch(() => {
            throw new BadRequestException('Invite code not valid or expired');
        });

        return { tenantName: inviteCode.tenant.name };
    }

    getActiveInviteCodeByTenantId(tenantId: string): Promise<TenantInviteCodeDto | null> {
        return this.inviteCodeRepository.findOneBy({
            tenantId,
            expirationDate: MoreThanOrEqual(new Date())
        }).then(inviteCode => inviteCode ? ({ inviteCode: inviteCode.inviteId }) : null);
    }

    async createInviteCodeByTenantId(tenantId: string) {
        const tenant = await this.tenantRepository
            .findOneByOrFail({ id: tenantId })
            .catch(() => {
                throw new NotFoundException('Cannot find tenant with id: ', tenantId);
            });

        await this.inviteCodeRepository.findBy({
            tenantId: tenant.id,
            expirationDate: LessThan(new Date())
        }).then(codes => {
            if (codes.length > 0) {
                this.inviteCodeRepository.delete([...codes.map(code => code.inviteId)]);
                this.logger.log('Removed expired invite codes for tenant with id: ', tenant.id);
            }
        });

        const newInviteCode = {
            tenantId: tenant.id,
            creationDate: dayjs(),
            expirationDate: dayjs().add(7, 'days')
        };

        return this.inviteCodeRepository.save(newInviteCode)
            .then(inviteCode => ({ inviteCode: inviteCode.inviteId }));
    }

    async delete(tenantId: string) {
        await this.tenantRepository
            .findOneByOrFail({ id: tenantId }).catch(() => {
                throw new BadRequestException('Cannot find tenant with provided id', 'BadTenantID');
            });

        await this.tenantRepository
            .delete(tenantId).catch(() => {
                throw new BadRequestException('Cannot delete tenant related to other resources', 'RelatedTenant');
            });
    }
}
