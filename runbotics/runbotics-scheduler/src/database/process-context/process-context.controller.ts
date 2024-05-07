import { Body, Controller, Delete, HttpException, HttpStatus, Param, Post, Request, UsePipes } from '@nestjs/common';
import { AuthRequest } from '#/types';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { startProcessSchema } from '#/utils/pipes';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey, JobData, ProcessInput, TriggerEvent } from 'runbotics-common';
import { Job, JobId } from 'bull';
import { checkMessageProperty, checkStatusProperty } from '#/utils/error-message.utils';
import { ProcessContextService } from '#/database/process-context/process-context.service';

@Controller('scheduler/rest/api/:tenantId/')
export class ProcessContextController {
    private readonly logger = new Logger(ProcessContextController.name);

    constructor(
        processContextService: ProcessContextService,
    ) {}

    @FeatureKeys(FeatureKey.PROCESS_EDIT_STRUCTURE)
    @Post(':processId')
    @UsePipes(new SchemaValidationPipe(startProcessSchema))
    async triggerProcess(
        @Param('processId') processId: number,
        @Body() input: ProcessInput,
        @Request() request: AuthRequest,
    ) {
        try {
            const process = await this.queueService.getProcessById(processId);
            await this.queueService.validateProcessAccess({ process: process, user: request.user, triggered: true });

            const { orchestratorProcessInstanceId } = await this.queueService.createInstantJob({
                process,
                input,
                user: request.user,
                trigger: { name: TriggerEvent.API },
                triggerData: { userEmail: request.user.email }
            });
            this.logger.log(`<= Process ${processId} successfully started`);

            return { orchestratorProcessInstanceId };
        } catch (err: unknown) {
            this.logger.error(`<= Process ${processId} failed to start`);

            const message = checkMessageProperty(err) || 'Internal server error';
            const statusCode = checkStatusProperty(err) || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException({ message, statusCode }, statusCode);
        }
    }

    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EXECUTE)
    @Delete(':jobId')
    async removeProcess(
        @Param('jobId') jobId: JobId,
        @Request() request: AuthRequest,
    ) {
        try {
            this.logger.log(`Trying to remove job (${jobId}) from queue`);

            const job: Job<JobData> = await this.schedulerService.getJobById(jobId);
            const process = await this.queueService.getProcessById(job.data.process?.id);
            await this.queueService.validateProcessAccess({ process: process, user: request.user, triggered: true });

            this.logger.log(`=> Removing job (${jobId}) from queue`);

            await this.queueService.deleteJobFromQueue(jobId);

            this.logger.log(`<= Job (${jobId}) successfully removed`);
        } catch (err: unknown) {
            this.logger.error(`<= Failed to remove job (${jobId})`);

            const message = checkMessageProperty(err) || 'Internal server error';
            const statusCode = checkStatusProperty(err) || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException({ message, statusCode }, statusCode);
        }
    }
}
