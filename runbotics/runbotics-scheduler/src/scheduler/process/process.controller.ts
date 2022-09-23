import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Param, Post, Request, UsePipes } from '@nestjs/common';
import { AuthRequest, ProcessInput } from 'src/types';
import { SchedulerService } from '../scheduler.service';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { startProcessSchema } from 'src/utils/pipes';
import { Logger } from 'src/utils/logger';
import { FeatureKeys } from 'src/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';

@Controller('scheduler/processes')
export class ProcessController {
    private readonly logger = new Logger(ProcessController.name);

    constructor(private schedulerService: SchedulerService) { }

    @FeatureKeys(FeatureKey.PROCESS_START)
    @Post(':processInfo/start')
    @UsePipes(new SchemaValidationPipe(startProcessSchema))
    async startProcess(
        @Param('processInfo') processInfo: string,
        @Body() input: ProcessInput,
        @Request() request: AuthRequest,
    ) {
        try {
            this.logger.log(`=> Starting process ${processInfo}`);
            const process = await this.schedulerService.getProcessByInfo(processInfo)
            await this.schedulerService.validateProcessAccess({ process: process, user: request.user })

            const response = await this.schedulerService.addNewInstantJob({ process, input, user: request.user });
            this.logger.log(`<= Process ${processInfo} successfully started`);

            return response;
        } catch (err) {
            this.logger.error(`<= Process ${processInfo} failed to start`);
            throw new HttpException({
                message: err?.message ?? 'Internal server error',
                statusCode: err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            }, err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
