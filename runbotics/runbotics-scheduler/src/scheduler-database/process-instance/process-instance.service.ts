import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessInstance } from './process-instance.entity';
import {
    EntityManager,
    FindManyOptions,
    FindOptionsRelations,
    IsNull,
    MoreThan,
    Repository,
} from 'typeorm';
import { IBot, ProcessInstanceStatus, Tenant } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { CreateProcessInstanceDto } from './dto/create-process-instance.dto';
import { User } from '#/scheduler-database/user/user.entity';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage, Page } from '#/utils/page/page';
import { isTenantAdmin } from '#/utils/authority.utils';
import { ProcessService } from '../process/process.service';

type MappedProcessInstance = ProcessInstance & { hasSubprocesses: boolean };

const RELATIONS: FindOptionsRelations<ProcessInstance> = {
    bot: true,
    process: true,
    user: true,
    trigger: true,
};

@Injectable()
export class ProcessInstanceService {
    private readonly logger = new Logger(ProcessInstanceService.name);

    constructor(
        @InjectRepository(ProcessInstance)
        private readonly processInstanceRepository: Repository<ProcessInstance>,
        private readonly processService: ProcessService,
    ) {}

    withEntityManager(em: EntityManager): ProcessInstanceService {
        return new ProcessInstanceService(
            em.getRepository(ProcessInstance),
            this.processService.withEntityManager(em)
        )
    }

    async create(processInstanceDto: CreateProcessInstanceDto) {
        const createdInstance = await this.processInstanceRepository.save(
            processInstanceDto
        );
        return this.processInstanceRepository.findOne({
            where: { id: createdInstance.id },
            relations: RELATIONS,
        });
    }

    async getAll(user: User, specs: Specs<ProcessInstance>) {
        const options: FindManyOptions<ProcessInstance> = {
            ...specs,
        };

        options.relations = RELATIONS;
        options.where = {
            ...options.where,
            process: {
                tenantId: user.tenantId,
            },
        };

        const processInstances = await this.processInstanceRepository.find(
            options
        );

        const mappedProcessInstances = (await this.processInstanceMapper(
            processInstances
        )) as MappedProcessInstance[];

        return mappedProcessInstances;
    }

    async getPage(
        user: User,
        specs: Specs<ProcessInstance>,
        paging: Paging,
        processId: string,
    ): Promise<Page<ProcessInstance>> {
        const options: FindManyOptions<ProcessInstance> = {
            ...paging,
            ...specs,
        };

        if (
            !isTenantAdmin(user) &&
            (
                specs.where.processId === undefined ||
                !await this.processService.hasAccess(user, +processId)
            )
        ) {
            throw new ForbiddenException('No access to whole page');
        }

        options.relations = RELATIONS;
        options.where = {
            ...options.where,
            process: {
                tenantId: user.tenantId,
            },
        };

        const processInstancePage = await getPage(
            this.processInstanceRepository,
            options
        );

        const mappedProcessInstances = (await this.processInstanceMapper(
            processInstancePage.content
        )) as MappedProcessInstance[];

        return {
            ...processInstancePage,
            content: mappedProcessInstances,
        };
    }

    async getOne(id: ProcessInstance['id'], user: User) {
        const processInstance = await this.processInstanceRepository
            .findOneOrFail({
                where: {
                    id,
                    process: {
                        tenantId: user.tenantId,
                    },
                },
                relations: RELATIONS,
            })
            .catch(() => {
                throw new NotFoundException(
                    `Could not find process instance with id ${id}`
                );
            });

        const mappedProcessInstance = (await this.processInstanceMapper(
            processInstance
        )) as MappedProcessInstance;

        return mappedProcessInstance;
    }

    async getSubprocesses(
        id: ProcessInstance['id'],
        user: User,
        paging: Paging
    ): Promise<Page<ProcessInstance>> {
        const options: FindManyOptions<ProcessInstance> = {
            ...paging,
        };

        options.relations = RELATIONS;
        options.where = [
            {
                process: {
                    tenantId: user.tenantId,
                },
                parentProcessInstanceId: id,
            },
            {
                process: {
                    tenantId: user.tenantId,
                },
                parentProcessInstanceId: IsNull(),
                rootProcessInstanceId: id,
            },
        ];

        const subprocessesPage = await getPage(
            this.processInstanceRepository,
            options
        );

        const mappedSubprocesses = (await this.processInstanceMapper(
            subprocessesPage.content
        )) as MappedProcessInstance[];

        return {
            ...subprocessesPage,
            content: mappedSubprocesses,
        };
    }

    findOneById(id: ProcessInstance['id']) {
        return this.processInstanceRepository.findOne({
            where: { id },
            relations: RELATIONS,
        });
    }

    findAllByBotId(id: IBot['id'], tenantId: Tenant['id']) {
        return this.processInstanceRepository.find({
            where: {
                bot: { id },
                process: { tenantId },
            },
            relations: RELATIONS,
        });
    }

    findAllActiveByBotId(id: IBot['id']) {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const sevenDaysFromNow = date.toISOString();
        return this.processInstanceRepository.find({
            where: {
                bot: { id },
                status: ProcessInstanceStatus.IN_PROGRESS,
                created: MoreThan(sevenDaysFromNow),
            },
            relations: RELATIONS,
        });
    }

    private async hasSubprocesses(id: ProcessInstance['id']) {
        const result = await this.processInstanceRepository
            .createQueryBuilder('process_instance')
            .select(
                'CASE WHEN EXISTS (SELECT sub.id FROM process_instance sub WHERE sub.parent_process_instance_id = :id OR sub.root_process_instance_id = :id) THEN TRUE ELSE FALSE END',
                'hasSubprocesses'
            )
            .setParameter('id', id)
            .getRawOne();

        return result.hasSubprocesses as boolean;
    }

    private async processInstanceMapper(
        data: ProcessInstance | ProcessInstance[]
    ) {
        if (Array.isArray(data)) {
            return Promise.all(
                data.map(async (instance) => {
                    const hasSubprocesses = await this.hasSubprocesses(
                        instance.id
                    );
                    return {
                        ...instance,
                        hasSubprocesses,
                    };
                })
            );
        }
        const hasSubprocesses = await this.hasSubprocesses(data.id);
        return {
            ...data,
            hasSubprocesses,
        };
    }
}
