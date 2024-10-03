import { Logger } from '#/utils/logger';
import { Controller, Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcessOutput } from './process-output.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Controller('/api/scheduler/process-outputs')
export class ProcessOutputController {
    private readonly logger = new Logger(ProcessOutputController.name);

    constructor(
        @InjectRepository(ProcessOutput)
        private readonly processOutputRepository: Repository<ProcessOutput>
    ) {}

    @Get()
    getAllProcessOutputTypes() {
        this.logger.log('REST request to get all process output types');
        return this.processOutputRepository.find();
    }
}
