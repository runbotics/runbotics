import { Body, Controller, HttpException, HttpStatus, Param, Post, Request, UsePipes } from '@nestjs/common';
import { AuthRequest } from '#/types';
import { QueueService } from '../queue.service';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { startProcessSchema } from '#/utils/pipes';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey, ProcessInput, TriggerEvent } from 'runbotics-common';
import { ProcessGuestService } from './process-guest.service';
import { GuestService } from '#/database/guest/guest.service';
import { checkMessageProperty, checkStatusProperty } from '#/utils/error-message.utils';

@Controller('scheduler/processes')
export class ProcessController {
    private readonly logger = new Logger(ProcessController.name);

    constructor(
        private readonly queueService: QueueService,
        private readonly processGuestService: ProcessGuestService,
        private readonly guestService: GuestService,
    ) { }

    @FeatureKeys(FeatureKey.PROCESS_START)
    @Post(':processId/start')
    @UsePipes(new SchemaValidationPipe(startProcessSchema))
    async startProcess(
        @Param('processId') processId: number,
        @Body() input: ProcessInput,
        @Request() request: AuthRequest,
    ) {
        const userId = request.user.id;
        const isUserGuest = this.processGuestService.getIsGuest(request.user.authorities);
        const initialExecutionsCount = isUserGuest ? await this.processGuestService.getExecutionsCount(userId) : null;
        try {
            this.logger.log(`Checking if user (${userId}) is a guest and can start process ${processId}`);
            await this.processGuestService.checkCanStartProcess(request.user);

            this.logger.log(`=> Starting process ${processId}`);
            const process = await this.queueService.getProcessById(processId);
            await this.queueService.validateProcessAccess({ process: process, user: request.user });

            const { orchestratorProcessInstanceId } = await this.queueService.createInstantJob({
                process,
                input,
                user: request.user,
                trigger: { name: TriggerEvent.MANUAL },
                triggerData: { userEmail: request.user.email }
            });

            this.logger.log(`<= Process ${processId} successfully started`);

            if (!isUserGuest) return { orchestratorProcessInstanceId };

            await this.guestService.incrementExecutionsCount(userId);
            this.logger.log(`Incremented user's (${userId}) executions-count to ${initialExecutionsCount + 1}`);

            return { orchestratorProcessInstanceId };
        } catch (err: unknown) {
            this.logger.error(`<= Process ${processId} failed to start`);

            if(isUserGuest) {
                await this.guestService.setExecutionsCount(userId, initialExecutionsCount);
                this.logger.log(`Restored user's executions-count to ${initialExecutionsCount}`);
            }

            const message = checkMessageProperty(err) || 'Internal server error';
            const statusCode = checkStatusProperty(err) || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException({ message, statusCode }, statusCode);
        }
    }
}
