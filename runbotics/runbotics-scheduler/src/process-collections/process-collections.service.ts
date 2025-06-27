import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import { PermissionCheckService } from '#/process-collections/permission-check/permission-check.service';
import { GrantPermissionData } from '#/process-collections/dto/grant-permission.dto';

@Injectable()
export class ProcessCollectionsService {
    private readonly logger = new Logger(ProcessCollectionsService.name);

    constructor(
        private readonly permissionManagementService: PermissionManagementService,
        private readonly permissionCheckService: PermissionCheckService,
    ) {
    }

    async grantPermission(data: GrantPermissionData) {
        const { collectionId, userId, user, tenantId, privilegeType, req } = data;

        if (await this.permissionCheckService.authorize(req, collectionId)) {
            this.logger.log('User authorized');
            
        } else {
            this.logger.warn('User failed to authorize');
            throw new UnauthorizedException();
        }
    }

}
