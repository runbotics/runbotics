import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessInstance } from './process-instance.entity';
import {
    FindManyOptions,
    FindOptionsRelations,
    IsNull,
    MoreThan,
    Repository,
} from 'typeorm';
import { IBot, ProcessInstanceStatus, Tenant } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { CreateProcessInstanceDto } from './dto/create-process-instance.dto';
import { UpdateProcessInstanceDto } from './dto/update-process-instance.dto';
import { UserEntity } from '#/database/user/user.entity';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage, Page } from '#/utils/page/page';

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
        private readonly processInstanceRepository: Repository<ProcessInstance>
    ) {}

    create(processInstanceDto: CreateProcessInstanceDto) {
        const newProcessInstance =
            this.processInstanceRepository.create(processInstanceDto);

        return this.processInstanceRepository.save(newProcessInstance);
    }

    async getAll(user: UserEntity, specs: Specs<ProcessInstance>) {
        const options: FindManyOptions<ProcessInstance> = {
            ...specs,
        };

        options.relations = RELATIONS;
        options.where = {
            process: {
                tenantId: user.tenantId,
            },
        };

        const processInstances = await this.processInstanceRepository.find(
            options
        );

        return processInstances;
    }

    async getPage(
        user: UserEntity,
        specs: Specs<ProcessInstance>,
        paging: Paging
    ): Promise<Page<ProcessInstance>> {
        const options: FindManyOptions<ProcessInstance> = {
            ...paging,
            ...specs,
        };

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

        return processInstancePage;
    }

    async getOne(id: ProcessInstance['id'], user: UserEntity) {
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

        return processInstance;
    }

    async getSubprocesses(
        id: ProcessInstance['id'],
        user: UserEntity,
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

        return subprocessesPage;
    }

    async update(
        id: ProcessInstance['id'],
        processInstanceDto: UpdateProcessInstanceDto
    ) {
        await this.processInstanceRepository
            .findOneByOrFail({ id })
            .catch(() => {
                throw new BadRequestException(
                    `Cannot find process instance with provided id ${id}`
                );
            });

        return this.processInstanceRepository.update(id, processInstanceDto);
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
        return this.processInstanceRepository.find({
            where: {
                bot: { id },
                status: ProcessInstanceStatus.IN_PROGRESS,
                created: MoreThan(date.toISOString()),
            },
            relations: RELATIONS,
        });
    }
}
