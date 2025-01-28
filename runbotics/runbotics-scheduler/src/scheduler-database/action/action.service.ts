import { Logger } from '#/utils/logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './action.entity';
import { Repository } from 'typeorm';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';


@Injectable()
export class ActionService {
    private readonly logger = new Logger(ActionService.name);

    constructor(
        @InjectRepository(Action)
        private readonly actionRepository: Repository<Action>,
    ) {}

    getAll(tenantId: string) {
        return this.actionRepository.findBy({ tenantId });
    }

    getById(tenantId: string, id: string) {
        return this.actionRepository.findBy({ tenantId, id });
    }

    async create(tenantId: string, createActionDto: CreateActionDto) {
        const existingAction = await this.actionRepository
            .findOneBy({ tenantId, id: createActionDto.id });

        if (existingAction) {
            throw new BadRequestException('Action with this id exist');
        }

        const newAction = new Action();
        newAction.tenantId = tenantId;
        newAction.id = createActionDto.id;
        newAction.label = createActionDto.label;
        newAction.form = createActionDto.form;
        newAction.script = createActionDto.script;
        newAction.credentialType = createActionDto.credentialType;

        return this.actionRepository.save(newAction);
    }

    async update(
        id: string,
        tenantId: string,
        updateActionDto: UpdateActionDto,
    ) {
        const updatedAction = await this.actionRepository
            .findOneByOrFail({ tenantId, id })
            .then((action) => ({
                ...action,
                ...updateActionDto,
            }))
            .catch(() => {
                this.logger.error('Cannot find action with id: ', id);
                throw new BadRequestException('Action not found');
            });

        return this.actionRepository.save(updatedAction);
    }

    async delete(tenantId: string, id: string) {
        await this.actionRepository
            .findOneByOrFail({ tenantId, id })
            .catch(() => {
                throw new BadRequestException('Cannot find action with provided id');
            });

        await this.actionRepository.delete(id);
    }
}