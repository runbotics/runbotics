import { Body, Controller, HttpException, HttpStatus, Param, Post, Request, Res, UsePipes } from '@nestjs/common';
import { AuthRequest } from '#/types';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { startProcessSchema } from '#/utils/pipes';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey, JobData, ProcessInput, TriggerEvent } from 'runbotics-common';
import { QueueService } from '../queue.service';
import { Job, JobId } from 'bull';
import { Response } from 'express';

@Controller('scheduler/trigger')
export class TriggerController {
    private readonly logger = new Logger(TriggerController.name);

    constructor(private queueService: QueueService) { }

    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EXECUTE)
    @Post(':processId')
    @UsePipes(new SchemaValidationPipe(startProcessSchema))
    async triggerProcess(
        @Param('processId') processId: number,
        @Body() input: ProcessInput,
        @Request() request: AuthRequest,
    ) {
        try {
            this.logger.log(`=> Starting process ${processId}`);
            const process = await this.queueService.getProcessById(processId);
            await this.queueService.validateProcessAccess({ process: process, user: request.user, triggered: true });

            const response = await this.queueService.createInstantJob({
                process,
                input,
                user: request.user,
                trigger: { name: TriggerEvent.API },
                triggerData: { userEmail: request.user.email }
            });
            this.logger.log(`<= Process ${processId} successfully started`);

            return response.id;
        } catch (err: any) {
            this.logger.error(`<= Process ${processId} failed to start`);
            throw new HttpException({
                message: err?.message ?? 'Internal server error',
                statusCode: err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            }, err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EXECUTE)
    @Post('terminate/:jobId')
    async terminateJob(
        @Param('jobId') jobId: JobId,
        @Request() request: AuthRequest,
        @Res() res: Response
    ) {
        this.logger.log(`Trying to terminate job: ${jobId}`);
        try {
            const job: Job<JobData> = await this.queueService.getJobById(jobId);
            const process = await this.queueService.getProcessById(job.data.process?.id);
            await this.queueService.validateProcessAccess({ process: process, user: request.user, triggered: true });

            this.logger.log(`=> Terminating job ${jobId}`);
            await this.queueService.deleteJobFromQueue(jobId.toString());

            this.logger.log(`<= Job ${jobId} successfully removed`);

            return res.status(HttpStatus.OK);
        } catch (err: any) {
            this.logger.log(`Terminating job ${jobId} failed`);
            throw new HttpException({
                message: err?.message ?? 'Internal server error',
                statusCode: err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            }, err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
