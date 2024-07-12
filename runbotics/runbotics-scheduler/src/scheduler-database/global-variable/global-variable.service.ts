import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '#/utils/logger';

import { GlobalVariable } from './global-variable.entity';

@Injectable()
export class GlobalVariableService {
    private readonly logger = new Logger(GlobalVariableService.name);

    constructor(
        @InjectRepository(GlobalVariable)
        private readonly globalVariableRepository: Repository<GlobalVariable>,
    ) {}
}