import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository, FindOptionsRelations } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { BotSystem, DefaultCollections, ProcessOutputType, Role } from 'runbotics-common';
import { UserEntity } from '../user/user.entity';
import { CreateProcessDto } from '#/database/process/dto/create-process.dto';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { UpdateProcessDto } from '#/database/process/dto/update-process.dto';
import { UpdateDiagramDto } from '#/database/process/dto/update-diagram.dto';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { getPage } from '#/utils/page/page';
import { Paging } from '#/utils/page/pageable.decorator';
import { Specs } from '#/utils/specification/specifiable.decorator';

const RELATIONS: FindOptionsRelations<ProcessEntity> = {
    system: true,
    botCollection: true,
    output: true,
};

@Injectable()
export class ProcessCrudService {
    constructor(
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
        @InjectRepository(ProcessCollectionEntity)
        private processCollectionRepository: Repository<ProcessCollectionEntity>,
        @InjectRepository(GlobalVariable)
        private globalVariableRepository: Repository<GlobalVariable>,
    ) {
    }

    async checkCreateProcessViability(user: UserEntity) {
        if (user.authorities.some(authority => authority.name === Role.ROLE_GUEST)) {
            const count = await this.processRepository.countBy({ createdBy: { id: user.id } });

            return count === 0;
        }

        return true;
    }

    create(user: UserEntity, processDto: CreateProcessDto) {
        const process = new ProcessEntity();
        process.tenantId = user.tenantId;
        process.createdBy = user;

        process.name = processDto.name;
        process.description = processDto.description;
        process.definition = processDto.definition;
        process.isPublic = processDto.isPublic;
        process.isAttended = processDto.isAttended;
        process.isTriggerable = processDto.isTriggerable;

        process.editor = user;
        process.processCollectionId = processDto.processCollection?.id;
        process.botCollectionId = processDto.botCollection.id;
        process.outputType = processDto.outputType?.type;
        process.systemName = processDto.system.name;

        if (processDto.tags.length > 15) {
            throw new BadRequestException('Tag limit of 15 exceeded');
        }

        // { id } is enough to persist a relation
        process.tags = processDto.tags as Tag[];

        return this.processRepository.save(process);
    }

    async createGuestProcess() {
        const process = new ProcessEntity();
        process.definition = EMPTY_PROCESS_DEFINITION;
        process.name = 'DEMO';
        process.isPublic = false;
        process.systemName = BotSystem.LINUX;
        process.outputType = ProcessOutputType.TEXT;

        const guestCollection = await this.processCollectionRepository.findOneBy({ name: DefaultCollections.GUEST });

        process.botCollectionId = guestCollection.id;

        return process;
    }

    async update(tenantId: string, id: number, processDto: UpdateProcessDto) {
        const process = await this.processRepository.findOneBy({ tenantId, id });

        if (!process) {
            throw new NotFoundException();
        }

        const partial: Partial<ProcessEntity> = {};

        process.name = processDto.name;
        process.description = processDto.description;
        process.definition = processDto.definition;
        process.isPublic = processDto.isPublic;
        partial.isAttended = processDto.isAttended;
        partial.isTriggerable = processDto.isTriggerable;

        partial.botCollectionId = processDto.botCollection?.id;
        partial.outputType = processDto.outputType?.type;
        partial.systemName = processDto.system?.name;

        if (processDto.tags?.length > 15) {
            throw new BadRequestException('Tag limit of 15 exceeded');
        }

        // { id } is enough to persist a relation
        partial.tags = processDto.tags as Tag[] | undefined;

        await this.processRepository.update({ tenantId, id }, partial);

        return this.processRepository.findOneBy({ tenantId, id });
    }

    async updateDiagram(user: UserEntity, id: number, updateDiagramDto: UpdateDiagramDto) {
        const process = await this.processRepository.findOneBy({ tenantId: user.tenantId, id });
        if (!process) {
            throw new NotFoundException();
        }

        process.globalVariables = await this.globalVariableRepository.findBy({
            id: In(updateDiagramDto.globalVariableIds),
        });

        process.definition = updateDiagramDto.definition;
        process.executionInfo = updateDiagramDto.executionInfo;
        process.editor = user;

        return this.processRepository.save(process);
    }

    getAll(user: UserEntity, specs: Specs<ProcessEntity>) {
        const options: FindManyOptions<ProcessEntity> = {
            ...specs,
        };
        options.relations = RELATIONS;

        options.where = {
            tenantId: user.tenantId,
        };

        return this.processRepository.find(options);
    }

    getPage(user: UserEntity, specs: Specs<ProcessEntity>, paging: Paging) {
        const options: FindManyOptions<ProcessEntity> = {
            ...paging,
            ...specs
        };
        
        options.where = {
            tenantId: user.tenantId,
        };
        
        options.relations = RELATIONS;

        return getPage(this.processRepository, options);
    }

    get(user: UserEntity, id: number) {
        return this.processRepository.findOne({
            where: {
                tenantId: user.tenantId,
                id,
            },
            relations: RELATIONS,
        });
    }

    async delete(user: UserEntity, id: number) {
        await this.processRepository.delete({
            tenantId: user.tenantId,
            id,
        });

        return id;
    }

    count(user: UserEntity) {
        return this.processRepository.countBy({
            tenantId: user.tenantId,
        });
    }


}
