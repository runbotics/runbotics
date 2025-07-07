import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { AuthRequest } from '#/types';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '#/utils/logger';

@Injectable()
export class OwnerHandler extends BaseAuthorizationHandler {
    private readonly logger = new Logger(OwnerHandler.name)
    constructor(
        @InjectRepository(ProcessCollection)
        private readonly processCollectionRepository: TreeRepository<ProcessCollection>) {
        super();
    }

    async handle(request: AuthRequest, collectionId: string): Promise<boolean> {
        const processCollection = await this.processCollectionRepository.findOne({ where: { id: collectionId }, relations: ['createdBy']});
        if (!processCollection) {
            throw new NotFoundException('No process collection found');
        }
        
        if (processCollection.ownerId === request.user.id) {
            this.logger.log(`Authorized by owner handler for ${request.user.id}`);
            return true;
        }

        return super.handle(request);
    }
}
