import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';
import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Logger } from '#/utils/logger';

@Injectable()
export class TenantService {
    private readonly logger = new Logger(TenantService.name);

    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>
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
            created: new Date(),
            updated: new Date(),
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
                updated: new Date(),
                lastModifiedBy: requester.email
            })).catch(() => {
                this.logger.error('Cannot find tenant with id: ', id);
                throw new BadRequestException('Tenant not found', 'NotFound');
            });

        return this.tenantRepository.save(updatedTenant);
    }
}
