import { Injectable } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { Role } from 'runbotics-common';
import { AuthRequest } from '#/types';
import { hasRole } from '#/utils/authority.utils';
import { Logger } from '#/utils/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { TreeRepository } from 'typeorm';

@Injectable()
export class TenantAdminHandler extends BaseAuthorizationHandler {
    private readonly logger = new Logger(TenantAdminHandler.name);

    constructor(@InjectRepository(ProcessCollection)
    private readonly processCollectionRepository: TreeRepository<ProcessCollection>) {
        super();
    }

    async handle(request: AuthRequest, collectionId?: string): Promise<boolean> {
        const processCollection = await this.processCollectionRepository.findOne({ where: { id: collectionId } });
        if (hasRole(
            request.user,
            Role.ROLE_TENANT_ADMIN,
        ) && processCollection && processCollection.tenantId === request.params.tenantId) {
            this.logger.log(`Authorized by tenant admin handler for ${request.user.id}`);
            return true;
        }
        return super.handle(request);
    }
}
