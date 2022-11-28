import { Body, Controller, HttpException, HttpStatus, Param, Post, Request, UsePipes } from '@nestjs/common';
import { AuthRequest, ProcessInput } from 'src/types';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { startProcessSchema } from 'src/utils/pipes';
import { Logger } from 'src/utils/logger';
import { FeatureKeys } from 'src/auth/featureKey.decorator';
import { FeatureKey, ProcessTrigger } from 'runbotics-common';
import { QueueService } from '../queue.service';

@Controller('scheduler/trigger')
export class TriggerController {
    private readonly logger = new Logger(TriggerController.name);

    constructor(private queueService: QueueService) { }

    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EXECUTE)
    @Post(':processInfo')
    @UsePipes(new SchemaValidationPipe(startProcessSchema))
    async triggerProcess(
        @Param('processInfo') processInfo: string,
        @Body() input: ProcessInput,
        @Request() request: AuthRequest,
    ) {
        try {
            this.logger.log(`=> Starting process ${processInfo}`);
            const process = await this.queueService.getProcessByInfo(processInfo);
            await this.queueService.validateProcessAccess({ process: process, user: request.user, triggered: true });

            const response = await this.queueService.createInstantJob({ process, input, user: request.user, trigger: ProcessTrigger.API });
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
