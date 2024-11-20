import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { BotSystemType, FeatureKey, ProcessDto, ProcessOutputType, Role } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import { CreateProcessDto } from '#/scheduler-database/process/dto/create-process.dto';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { PartialUpdateProcessDto, UpdateProcessDto } from '#/scheduler-database/process/dto/update-process.dto';
import { UpdateDiagramDto } from '#/scheduler-database/process/dto/update-diagram.dto';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { getPage, Page } from '#/utils/page/page';
import { Paging } from '#/utils/page/pageable.decorator';
import { whereOptionsToWhereOptionsArray, Specs } from '#/utils/specification/specifiable.decorator';
import { BotCollectionDefaultCollections } from '#/database/bot-collection/bot-collection.consts';
import { BotCollection } from '../bot-collection/bot-collection.entity';
import { UserService } from '../user/user.service';
import { TagService } from '../tags/tag.service';

const RELATIONS = ['tags', 'system', 'botCollection', 'output', 'createdBy', 'editor', 'processCollection.users'];

@Injectable()
export class ProcessCrudService {
    constructor(
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
        @InjectRepository(GlobalVariable)
        private globalVariableRepository: Repository<GlobalVariable>,
        @InjectRepository(BotCollection)
        private botCollectionRepository: Repository<BotCollection>,
        private readonly userService: UserService,
        private readonly tagService: TagService,
    ) {
    }

    async checkCreateProcessViability(user: User) {
        if (user.authorities.some(authority => authority.name === Role.ROLE_GUEST)) {
            const count = await this.processRepository.countBy({ createdBy: { id: user.id } });

            return count === 0;
        }

        return true;
    }

    async create(user: User, processDto: CreateProcessDto) {
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

    async update(user: User, id: number, processDto: UpdateProcessDto) {
        const process = await this.processRepository
            .findOneOrFail({
                where: {
                    id,
                    tenantId: user.tenantId,
                },
                relations: RELATIONS,
            })
            .catch(() => {
                throw new NotFoundException();
            });

        process.name = processDto.name;
        process.description = processDto.description;
        process.definition = processDto.definition;
        process.isPublic = processDto.isPublic;

        if (processDto.tags?.length > 15) {
            throw new BadRequestException('Tag limit of 15 exceeded');
        }

        process.tags = await Promise.all((processDto.tags as Tag[]).map(async (tag) => {
            const tagByName = await this.tagService.getByName(tag.name, user.tenantId);
            if (!tagByName) {
                const newTag = await this.tagService.create(user, tag);
                return newTag;
            }
            return tagByName;
        }));

        await this.processRepository.save(process);

        return this.processRepository.findOne({ where: { id }, relations: RELATIONS });
    }

    async partialUpdate(user: User, id: number, processDto: PartialUpdateProcessDto) {
        await this.processRepository
            .findOneOrFail({
                where: {
                    id,
                    tenantId: user.tenantId,
                },
                relations: RELATIONS,
            })
            .catch(() => {
                throw new NotFoundException();
            });

        const partial: Partial<ProcessEntity> = {};

        partial.isAttended = processDto.isAttended;
        partial.isTriggerable = processDto.isTriggerable;
        partial.botCollectionId = processDto.botCollection?.id;
        partial.systemName = processDto.system?.name;
        partial.outputType = processDto.output?.type;
        partial.executionInfo = processDto.executionInfo;

        await this.processRepository.update({ id, tenantId: user.tenantId }, partial);

        return this.processRepository.findOne({ where: { id }, relations: RELATIONS });
    }

    async updateDiagram(user: User, id: number, updateDiagramDto: UpdateDiagramDto) {
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

        await this.processRepository.save(process);

        return this.processRepository.findOne({ where: { id }, relations: RELATIONS });
    }

    getAll(user: User, specs: Specs<ProcessEntity>) {
        const options: FindManyOptions<ProcessEntity> = {
            ...specs,
        };
        options.relations = RELATIONS;

        options.where = whereOptionsToWhereOptionsArray<ProcessEntity>({
            ...(!this.hasTenantAllAccess(user) && {
                isPublic: true,
                createdBy: {
                    id: user.id,
                },
            })
        }, {
            ...options.where,
            tenantId: user.tenantId,
        });

        return this.processRepository.find(options);
    }

    async getPage(user: User, specs: Specs<ProcessEntity>, paging: Paging): Promise<Page<ProcessDto>> {
        const options: FindManyOptions<ProcessEntity> = {
            ...paging,
            ...specs,
        };
        const { name, tags, createdBy, ...restOptions } =
            options.where as FindOptionsWhere<ProcessEntity>;

        options.where = whereOptionsToWhereOptionsArray<ProcessEntity>({
            name,
            tags,
            createdBy,
        }, {
            ...restOptions,
            tenantId: user.tenantId,
        });

        options.relations = RELATIONS;

        const page = await getPage(this.processRepository, options);

        return {
            ...page,
            content: page.content
                .filter(({ isPublic, createdBy: { id } }) =>
                    !this.hasTenantAllAccess(user) ?
                        (isPublic || id === user.id)
                        : true
                )
                .map(this.formatUserDTO),
        };
    }

    get(user: User, id: number) {
        return this.processRepository.findOne({
            where: whereOptionsToWhereOptionsArray<ProcessEntity>({
                ...(!this.hasTenantAllAccess(user) && {
                    isPublic: true,
                    createdBy: {
                        id: user.id,
                    },
                })
            }, {
                id,
                tenantId: user.tenantId,
            }),
            relations: RELATIONS,
        });
    }

    async delete(user: User, id: number) {
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

    private hasTenantAllAccess(user: User) {
        return this.userService.hasFeatureKey(
            user,
            FeatureKey.TENANT_ALL_ACCESS
        );
    }
}
