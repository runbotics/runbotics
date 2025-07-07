import { Injectable } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { AuthRequest } from '#/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { Logger } from '#/utils/logger';

@Injectable()
export class PermissionTableHandler extends BaseAuthorizationHandler {
    private readonly logger = new Logger(PermissionTableHandler.name);
    constructor(
        @InjectRepository(ProcessCollectionUser)
        private readonly processCollectionRepository: Repository<ProcessCollectionUser>) {
        super();
    }

    async handle(request: AuthRequest, collectionId: string): Promise<boolean> {
        const processCollectionUser = this.processCollectionRepository.find({
            where: {
                processCollectionId: collectionId,
                userId: request.user.id,
            },
        });
        if (processCollectionUser) {
            this.logger.log(`Authorized by permission table handler for ${request.user.id}`);
            return true;
        }
        return super.handle(request);
    }
}
