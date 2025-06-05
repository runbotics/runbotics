import { FindManyOptions, FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '#/utils/logger';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { isTenantAdmin } from '#/utils/authority.utils';

import { GlobalVariable } from './global-variable.entity';
import { CreateGlobalVariableDto } from './dto/create-global-variable.dto';
import { UpdateGlobalVariableDto } from './dto/update-global-variable.dto';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';

const relations = ['user', 'creator', 'creator.email'];

@Injectable()
export class GlobalVariableService {
    private readonly logger = new Logger(GlobalVariableService.name);

    constructor(
        @InjectRepository(GlobalVariable)
        private readonly globalVariableRepository: Repository<GlobalVariable>,
        @InjectRepository(ProcessEntity)
        private readonly processRepository: Repository<ProcessEntity>,
    ) {}

    getAllByPage(tenantId: string, paging: Paging, search?: string, sortField?: string, sortDirection?: string) {
        const findOptions: FindManyOptions<GlobalVariable> = {
            where: { 
                tenantId,
                ...(search && { name: ILike(`%${search}%`)})
            },
            relations,
            order: {
                lastModified: 'DESC'
            },
            ...paging
        };
        this.logger.log(`REST request to get all global variables with tenantId: ${tenantId}, search: ${search}, sortField: ${sortField}, sortDirection: ${sortDirection}`);
        if (sortField === 'createdBy' || sortField === 'modifiedBy') {
            return this.globalVariableRepository
                .createQueryBuilder('globalVariable')
                .leftJoinAndSelect('globalVariable.creator', 'creator')
                .leftJoinAndSelect('globalVariable.user', 'user')
                .where('globalVariable.tenantId = :tenantId', { tenantId })
                .andWhere(search ? 'globalVariable.name ILIKE :search' : '1=1', { search: `%${search}%` })
                .orderBy(
                    sortField === 'createdBy'
                        ? 'creator.email'
                        : 'user.email',
                    sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
                )
                .skip(paging.skip)
                .take(paging.take)
                .getManyAndCount()
                .then(([content, total]) => {
                    const size = paging.take;
                    const page = Math.floor(paging.skip / paging.take);
                    const totalPages = Math.ceil(total / size);
                    const isFirstPage = page === 0;
                    const isLastPage = page >= totalPages - 1;

                    return {
                        content: content.map(globalVariable => this.formatUserDTO(globalVariable)),
                        totalElements: total,
                        totalPages,
                        number: page,
                        size,
                        numberOfElements: content.length,
                        first: isFirstPage,
                        last: isLastPage,
                        empty: content.length === 0,
                    };
            });
        }
 
        if (sortField) {
            findOptions.order = {
                [sortField]: sortDirection.toUpperCase(),
            };
        }

        return getPage(this.globalVariableRepository, findOptions).then(page => ({
            ...page,
            content: page.content.map(GlobalVariable => this.formatUserDTO(GlobalVariable))
        }));
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
