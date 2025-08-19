// process.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthRequest } from '#/types';
import { Logger } from '#/utils/logger';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';

@Injectable()
export class ActiveTenantGuard implements CanActivate {
    private readonly logger = new Logger(ActiveTenantGuard.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly reflector: Reflector,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: AuthRequest = context.switchToHttp().getRequest();
        const tenantId = req.params.tenantId;
        const pathRegex = /\/api\/scheduler\/tenants\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;

        if (!tenantId || typeof tenantId !== 'string' || !pathRegex.test(req.url)) {
            return true;
        }
        
        const tenant = await this.dataSource.manager.findOne(Tenant, {
            where: { id: tenantId },
            select: ['id', 'active'],
        });
        
        if(!tenant.active) {
            this.logger.warn(`Tenant with ID ${tenantId} is inactive.`);
            return false;
        }
        
        return true;
    }
}
