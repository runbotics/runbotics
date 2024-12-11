import { FindOptionsWhere, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '#/utils/logger';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { isTenantAdmin } from '#/utils/authority.utils';

import { GlobalVariable } from './global-variable.entity';
import { CreateGlobalVariableDto } from './dto/create-global-variable.dto';
import { UpdateGlobalVariableDto } from './dto/update-global-variable.dto';

const relations = ['user', 'creator'];

@Injectable()
export class GlobalVariableService {
    private readonly logger = new Logger(GlobalVariableService.name);

    constructor(
        @InjectRepository(GlobalVariable)
        private readonly globalVariableRepository: Repository<GlobalVariable>,
        @InjectRepository(ProcessEntity)
        private readonly processRepository: Repository<ProcessEntity>,
    ) {}

    getAll(tenantId: string) {
        const findOptions: FindOptionsWhere<GlobalVariable> = {
            tenantId,
        };

        return this.globalVariableRepository
            .find({ where: findOptions, relations })
            .then(globalVariables => globalVariables
                .map(globalVariable => this.formatUserDTO(globalVariable)));
    }

    getById(tenantId: string, id: number) {
        const findOptions: FindOptionsWhere<GlobalVariable> = {
            id,
            tenantId,
        };

        return this.globalVariableRepository
            .findOne({ where: findOptions, relations })
            .then(this.formatUserDTO);
    }

    async create(
        tenantId: string,
        user: User,
        globalVariableDto: CreateGlobalVariableDto
    ) {
        const existingGlobalVariable = await this.globalVariableRepository
            .findOneBy({ tenantId, name: globalVariableDto.name });

        if (existingGlobalVariable) {
            throw new BadRequestException('Global variable with that name exists', 'NameNotUnique');
        }

        const newGlobalVariable = new GlobalVariable();
        newGlobalVariable.name = globalVariableDto.name;
        newGlobalVariable.description = globalVariableDto.description;
        newGlobalVariable.value = globalVariableDto.value;
        newGlobalVariable.type = globalVariableDto.type;
        newGlobalVariable.creator = user;
        newGlobalVariable.user = user;
        newGlobalVariable.tenantId = tenantId;

        return this.globalVariableRepository
            .save(newGlobalVariable)
            .then(this.formatUserDTO);
    }

    async update(
        tenantId: string,
        user: User,
        globalVariableDto: UpdateGlobalVariableDto,
        id: number
    ) {
        const findOptions: FindOptionsWhere<GlobalVariable> = {
            tenantId, id,
            ...(!isTenantAdmin(user) && { creator: { id: user.id } })
        };

        const updatedGlobalVariable = await this.globalVariableRepository
            .findOneByOrFail(findOptions)
            .then(globalVariable => ({
                ...globalVariable,
                ...globalVariableDto,
                user: user
            })).catch(() => {
                this.logger.error('Cannot find global variable with id: ', id);
                throw new BadRequestException('Global variable not found', 'NotFound');
            });

        return this.globalVariableRepository
            .save(updatedGlobalVariable)
            .then(this.formatUserDTO);
    }

    async delete(tenantId: string, user: User, id: number) {
        const processesAssociatedWithGlobalVariable = await this.processRepository
            .findBy({ globalVariables: { id } });

        if (processesAssociatedWithGlobalVariable.length) {
            const processNames = processesAssociatedWithGlobalVariable.map(process => process.name);
            throw new BadRequestException(processNames, 'RelatedProcesses');
        }

        const findOptions: FindOptionsWhere<GlobalVariable> = {
            tenantId, id,
            ...(!isTenantAdmin(user) && { creator: { id: user.id } })
        };

        await this.globalVariableRepository
            .findOneByOrFail(findOptions).catch(() => {
                throw new BadRequestException('Cannot find global variable with provided id');
            });

        await this.globalVariableRepository.delete(id);
    }

    private formatUserDTO(globalVariable: GlobalVariable | null) {
        return globalVariable
            ? {
                  ...globalVariable,
                  ...(globalVariable.user && {
                      user: {
                          id: globalVariable.user.id,
                          email: globalVariable.user.email,
                      },
                  }),
                  ...(globalVariable.creator && {
                      creator: {
                          id: globalVariable.creator.id,
                          email: globalVariable.creator.email,
                      },
                  }),
              }
            : null;
    }
}
