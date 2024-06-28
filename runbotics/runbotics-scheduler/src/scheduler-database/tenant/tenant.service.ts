import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';
import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Logger } from '#/utils/logger';
import { TenantInviteCode } from './tenant-invite-code.entity';
import dayjs from 'dayjs';
import { TenantInviteCodeDto } from './dto/invite-code.dto';

@Injectable()
export class TenantService {
    private readonly logger = new Logger(TenantService.name);

    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
        @InjectRepository(TenantInviteCode)
        private readonly inviteCodeRepository: Repository<TenantInviteCode>
    ) {}

    getTenantById(id: string) {
        return this.tenantRepository.findOneBy({ id });
    }

    getAllTenants() {
        return this.tenantRepository.find();
    }

    async createTenant(tenantDto: CreateTenantDto, requester: UserEntity): Promise<Tenant> {
        const tenantByName = await this.tenantRepository.findOneBy({ name: tenantDto.name });
        if (tenantByName) throw new BadRequestException('Name already exist', 'NameExist');

        const newTenant = {
            ...tenantDto,
            created: dayjs(),
            updated: dayjs(),
            createdById: requester.id,
            lastModifiedBy: requester.email
        };

        return this.tenantRepository.save(newTenant);
    }

    async updateTenant(
        tenantDto: UpdateTenantDto,
        id: string,
        requester: UserEntity
    ): Promise<Tenant> {
        const tenantByName = await this.tenantRepository.findOneBy({ name: tenantDto.name });
        if (tenantByName) throw new BadRequestException('Name already exist', 'NameExist');

        const updatedTenant = await this.tenantRepository
            .findOneByOrFail({ id })
            .then(tenant => ({
                ...tenant,
                ...tenantDto,
                updated: dayjs(),
                lastModifiedBy: requester.email
            })).catch(() => {
                this.logger.error('Cannot find tenant with id: ', id);
                throw new BadRequestException('Tenant not found', 'NotFound');
            });

        return this.tenantRepository.save(updatedTenant);
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

        const newInviteCode = {
            tenantId: tenant.id,
            creationDate: dayjs(),
            expirationDate: dayjs().add(7, 'days')
        };

        return this.inviteCodeRepository.save(newInviteCode);
    }
}
