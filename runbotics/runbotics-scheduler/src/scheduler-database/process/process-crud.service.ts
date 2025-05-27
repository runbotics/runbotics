import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { BotSystemType, ProcessDto, ProcessOutputType, Role } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import { CreateProcessDto } from '#/scheduler-database/process/dto/create-process.dto';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { PartialUpdateProcessDto, UpdateProcessDto } from '#/scheduler-database/process/dto/update-process.dto';
import { UpdateDiagramDto } from '#/scheduler-database/process/dto/update-diagram.dto';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { getPage, Page } from '#/utils/page/page';
import { Paging } from '#/utils/page/pageable.decorator';
import { mapToWhereOptionsArray, Specs } from '#/utils/specification/specifiable.decorator';
import { BotCollectionDefaultCollections } from '#/scheduler-database/bot-collection/bot-collection.consts';
import { BotCollection } from '../bot-collection/bot-collection.entity';
import { TagService } from '../tags/tag.service';
import { isTenantAdmin } from '#/utils/authority.utils';
import { EMPTY_PROCESS_DEFINITION } from './consts/empty-process-definition';
import dayjs from 'dayjs';
import { findProcessActionTemplates } from '#/utils/bpmn/findProcessActionTemplates';
import { ProcessCredentialService } from '../process-credential/process-credential.service';
import { ProcessCredential } from '../process-credential/process-credential.entity';

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
        @Inject(forwardRef(() => ProcessCredentialService))
        private readonly processCredentialService: ProcessCredentialService,
        private readonly tagService: TagService,    ) {
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
        process.updated = dayjs().toISOString();

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

        process.tags = await Promise.all(
            processDto.tags.map(async (tag) => {
                const existingTag = await this.tagService.getByName(tag.name, user.tenantId);
                if (existingTag) return existingTag;

                const newTag = await this.tagService.create(user, tag);
                return newTag;
            })
        );

        const createdProcess = await this.processRepository.save(process);

        return this.processRepository.findOne({ where: { id: createdProcess.id }, relations: RELATIONS });
    }

    async createGuestProcess(user: User) {
        const process = new ProcessEntity();
        process.definition = EMPTY_PROCESS_DEFINITION;
        process.name = 'DEMO';
        process.isPublic = false;
        process.systemName = BotSystemType.LINUX;
        process.outputType = ProcessOutputType.TEXT;
        process.description = 'DEMO Process';
        process.createdBy = user;
        process.updated = dayjs().toISOString();

        const guestCollection = await this.botCollectionRepository.findOneBy({ name: BotCollectionDefaultCollections.GUEST });

        process.botCollectionId = guestCollection.id;

        const createdProcess = await this.processRepository.save(process);

        return this.processRepository.findOne({ where: { id: createdProcess.id }, relations: RELATIONS });
    }

    async update(user: User, id: number, processDto: UpdateProcessDto) {
        const process = await this.processRepository
            .findOneOrFail({
                where: {
                    id,
                    tenantId: user.tenantId,
                },
                relations: ['tags'],
            })
            .catch(() => {
                throw new NotFoundException();
            });

        process.name = processDto.name;
        process.description = processDto.description;
        process.definition = processDto.definition;
        process.isPublic = processDto.isPublic;
        process.processCollectionId = processDto.processCollection ? processDto.processCollection.id : null;
        process.updated = dayjs().toISOString();

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
        const currentProcess = await this.processRepository
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

        if (user.id !== Number(currentProcess.createdBy.id) && !isTenantAdmin(user)) {
            throw new ForbiddenException();
        }

        if ('executionInfo' in processDto) {
            partial.executionInfo = processDto.executionInfo;
        } else if ('isAttended' in processDto) {
            partial.isAttended = processDto.isAttended;
        } else if ('isTriggerable' in processDto && isTenantAdmin(user)) {
            partial.isTriggerable = processDto.isTriggerable;
        } else if ('botCollection' in processDto) {
            partial.botCollectionId = processDto.botCollection?.id;
        } else if ('system' in processDto) {
            partial.systemName = processDto.system?.name;
        } else if ('output' in processDto) {
            partial.outputType = processDto.output?.type;
        } else {
            throw new BadRequestException();
        }

        partial.updated = dayjs().toISOString();

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

        const allProcessCredentials = await this.processCredentialService.findAllByProcessId(process.id, user);
        const credentialTypes = await findProcessActionTemplates(updateDiagramDto.definition);

        const queryRunner = this.processRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            for (const credential of allProcessCredentials) {
                if (!credentialTypes.includes(credential.credential.template.name)) {
                    await queryRunner.manager.delete(ProcessCredential, credential.id);
                }
            }

            process.definition = updateDiagramDto.definition;
            process.executionInfo = updateDiagramDto.executionInfo;
            process.editor = user;
            process.updated = dayjs().toISOString();

            await queryRunner.manager.save(ProcessEntity, process);

            await queryRunner.commitTransaction();
        } catch {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException();
        } finally {
            await queryRunner.release();
        }

        return this.processRepository.findOne({ where: { id }, relations: RELATIONS });

    }

    getAll(user: User, specs: Specs<ProcessEntity>) {
        const options: FindManyOptions<ProcessEntity> = {
            ...specs,
        };
        options.relations = RELATIONS;

        options.where = mapToWhereOptionsArray<ProcessEntity>({
            orConditionProps: {
                ...(!isTenantAdmin(user) && {
                    isPublic: true,
                    createdBy: {
                        id: user.id,
                    },
                })
            },
            andConditionProps: {
                ...options.where,
                tenantId: user.tenantId,
            },
        });

        return this.processRepository.find(options);
    }

    async getAllSimplified(user: User, specs: Specs<ProcessEntity>) {
        const options: FindManyOptions<ProcessEntity> = {
            ...specs,
        };
        options.relations = RELATIONS;

        options.where = mapToWhereOptionsArray<ProcessEntity>({
            orConditionProps: {
                ...(!isTenantAdmin(user) && {
                    isPublic: true,
                    createdBy: {
                        id: user.id,
                    },
                })
            },
            andConditionProps: {
                ...options.where,
                tenantId: user.tenantId,
            }
        });

        const processes = await this.processRepository.find(options);

        return this.simplifiedProcessMapper(processes);
    }

    async getPage(user: User, specs: Specs<ProcessEntity>, paging: Paging): Promise<Page<ProcessDto>> {
        const accessibleProcessIds = await this.processRepository
            .find({
                where: mapToWhereOptionsArray<ProcessEntity>({
                    orConditionProps: {
                        ...(!isTenantAdmin(user) && {
                            isPublic: true,
                            createdBy: {
                                id: user.id,
                            },
                        }),
                    },
                    andConditionProps: {
                        tenantId: user.tenantId,
                    },
                }),
            })
            .then((processes) => processes.map(({ id }) => id));

        const options: FindManyOptions<ProcessEntity> = {
            ...paging,
            ...specs,
        };
        const { name, tags, createdBy, ...restOptions } =
            options.where as FindOptionsWhere<ProcessEntity>;

        options.where = mapToWhereOptionsArray<ProcessEntity>({
            orConditionProps: {
                name,
                tags,
                createdBy,
            },
            andConditionProps: {
                ...restOptions,
                id: In(accessibleProcessIds),
                tenantId: user.tenantId,
            },
        });

        options.relations = RELATIONS;

        const page = await getPage(this.processRepository, options);

        return {
            ...page,
            content: page.content.map(this.formatUserDTO),
        };
    }

    get(user: User, id: number) {
        return this.processRepository.findOne({
            where: mapToWhereOptionsArray<ProcessEntity>({
                orConditionProps: {
                    ...(!isTenantAdmin(user) && {
                        isPublic: true,
                        createdBy: {
                            id: user.id,
                        },
                    })
                },
                andConditionProps: {
                    id,
                    tenantId: user.tenantId,
                },
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

    private simplifiedProcessMapper (processes: ProcessEntity[]) {
        if (!processes.length) return [];

        return processes.map(process => ({
            id: process.id,
            name: process.name,
            system: process.system,
        }));
    }
}
