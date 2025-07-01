import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { AuthRequest } from '#/types';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { TreeRepository } from 'typeorm';
import { Logger } from '#/utils/logger';

@Injectable()
export class PublicCollectionHandler extends BaseAuthorizationHandler {
    private readonly logger = new Logger(PublicCollectionHandler.name);

    constructor(
        @InjectRepository(ProcessCollection)
        private readonly processCollectionRepository: TreeRepository<ProcessCollection>) {
        super();
    }

    async handle(request: AuthRequest, collectionId?: number): Promise<boolean> {
        const processCollection = await this.processCollectionRepository.findOne({
            where: { id: collectionId },
        });
        if (!processCollection) {
            throw new NotFoundException('No process collection found');
        }

        if (processCollection.isPublic) {
            this.logger.log('Authorized by public collection handler');
            return true;
        }
        return super.handle(request);
    }
}
