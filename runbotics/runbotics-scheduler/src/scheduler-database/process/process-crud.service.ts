import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, In, Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { BotSystemType, FeatureKey, ProcessOutputType, Role } from 'runbotics-common';
import { UserEntity } from '#/database/user/user.entity';
import { CreateProcessDto } from '#/scheduler-database/process/dto/create-process.dto';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { UpdateProcessDto } from '#/scheduler-database/process/dto/update-process.dto';
import { UpdateDiagramDto } from '#/scheduler-database/process/dto/update-diagram.dto';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { getPage, Page } from '#/utils/page/page';
import { Paging } from '#/utils/page/pageable.decorator';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { BotCollectionEntity } from '#/database/bot-collection/bot-collection.entity';
import { BotCollectionDefaultCollections } from '#/database/bot-collection/bot-collection.consts';

const RELATIONS: FindOptionsRelations<ProcessEntity> = {
    system: true,
    botCollection: true,
    output: true,
    createdBy: true,
    editor: true,
    tags: true,
};

@Injectable()
export class ProcessCrudService {
    constructor(
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
        @InjectRepository(GlobalVariable)
        private globalVariableRepository: Repository<GlobalVariable>,
        @InjectRepository(BotCollectionEntity)
        private botCollectionRepository: Repository<BotCollectionEntity>,
    ) {
    }

    async checkCreateProcessViability(user: UserEntity) {
        if (user.authorities.some(authority => authority.name === Role.ROLE_GUEST)) {
            const count = await this.processRepository.countBy({ createdBy: { id: user.id } });

            return count === 0;
        }

        return true;
    }

    async create(user: UserEntity, processDto: CreateProcessDto) {
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

        if(processDto.botCollection){
            process.botCollectionId = processDto.botCollection.id;
        }
        else {
            process.botCollectionId = (await this.botCollectionRepository.findOneByOrFail({ name: BotCollectionDefaultCollections.PUBLIC })).id;
        }
        process.outputType = processDto.output.type;
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
        process.systemName = BotSystemType.LINUX;
        process.outputType = ProcessOutputType.TEXT;

        const guestCollection = await this.botCollectionRepository.findOneBy({ name: BotCollectionDefaultCollections.GUEST });

        process.botCollectionId = guestCollection.id;

        return process;
    }

    async update(tenantId: string, id: number, processDto: UpdateProcessDto) {
        const process = await this.processRepository.findOneBy({ tenantId, id });

        if (!process) {
            throw new NotFoundException();
        }

        process.name = processDto.name;
        process.description = processDto.description;
        process.definition = processDto.definition;
        process.isPublic = processDto.isPublic;
        process.isAttended = processDto.isAttended;
        process.isTriggerable = processDto.isTriggerable;

        process.botCollectionId = processDto.botCollection?.id;
        process.outputType = processDto.output?.type;
        process.systemName = processDto.system?.name;

        if (processDto.tags?.length > 15) {
            throw new BadRequestException('Tag limit of 15 exceeded');
        }

        // TODO: create/link tags to process
        // partial.tags = processDto.tags as Tag[] | undefined;

        return this.processRepository.save(process);
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

    async getPage(user: UserEntity, specs: Specs<ProcessEntity>, paging: Paging): Promise<Page<ProcessEntity>> {
        const options: FindManyOptions<ProcessEntity> = {
            ...paging,
            ...specs,
        };

        options.where = {
            ...options.where,
            tenantId: user.tenantId,
            createdBy: user.hasFeatureKey(FeatureKey.TENANT_ALL_ACCESS) ? undefined : user,
        };

        options.relations = RELATIONS;

        const page = await getPage(this.processRepository, options);

        return {
            ...page,
            content: page.content.map(this.formatUserDTO),
        };
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

    private formatUserDTO(process: ProcessEntity) {
        return {
            ...process,
            createdBy: {
                id: process.createdBy.id,
                email: process.createdBy.email,
            },
            editor: {
                id: process.createdBy.id,
                email: process.createdBy.email,
            },
        };
    }
}
