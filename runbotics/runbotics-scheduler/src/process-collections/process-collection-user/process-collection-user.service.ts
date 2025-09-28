import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProcessCollectionUser } from './process-collection-user.entity';
import {
    AddProcessCollectionUserDto,
} from '#/process-collections/process-collection-user/dto/add-process-collection-user.dto';
import { inspect } from 'util';
import { Logger } from '#/utils/logger';

@Injectable()
export class ProcessCollectionUserService {
    private readonly logger = new Logger(ProcessCollectionUser.name);

    constructor(
        @InjectRepository(ProcessCollectionUser)
        private readonly processCollectionUserRepository: Repository<ProcessCollectionUser>,
    ) {
    }

    async addNewProcessCollectionUser(userId: number, processCollectionUser: AddProcessCollectionUserDto) {
        const newProcessCollectionUser = await this.processCollectionUserRepository.save({
            processCollectionId: processCollectionUser.collectionId,
            privilege_type: processCollectionUser.privilegeType,
            userId: processCollectionUser.userId ?? userId,
        });
        this.logger.log(inspect(newProcessCollectionUser, { depth: 3 }));
        return newProcessCollectionUser;
    }

    async getProcessCollectionUser(userId: number, processCollectionId: string): Promise<ProcessCollectionUser> {
        return this.processCollectionUserRepository.findOne({ where: { userId, processCollectionId } });
    }

    async deleteProcessCollectionUser(userId: number, processCollectionId: string): Promise<DeleteResult> {
        return this.processCollectionUserRepository.delete({ userId, processCollectionId });
    }

    async getAllProcessCollectionUserByCollectionId(processCollectionId: string): Promise<ProcessCollectionUser[]> {
        return this.processCollectionUserRepository.find({ where: { processCollectionId } });
    }
}
