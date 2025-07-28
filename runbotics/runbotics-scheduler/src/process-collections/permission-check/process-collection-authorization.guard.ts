import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionCheckService } from '#/process-collections/permission-check/permission-check.service';
import { AuthRequest } from '#/types';

@Injectable()
export class ProcessCollectionAuthorizationGuard implements CanActivate {
    constructor(
        private readonly permissionCheckService: PermissionCheckService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        const paramKey =
            this.reflector.get<string>('COLLECTION_ID', context.getHandler()) ??
            this.reflector.get<string>('COLLECTION_ID', context.getClass()) ??
            'id';

        const collectionId =
            request.params?.[paramKey] ?? request.body?.[paramKey] ?? request.query?.[paramKey];
        
        if (!collectionId) {
            throw new BadRequestException(
                `No param key in request params, body or query: ${paramKey}`,
            );
        }

        const allowed = await this.permissionCheckService.authorize(request, collectionId);

        if (!allowed) {
            throw new ForbiddenException('You do not have permission to access this process collection');
        }
        return true;
    }
}
