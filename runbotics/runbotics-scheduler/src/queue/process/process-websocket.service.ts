import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ProcessInput, TriggerEvent } from 'runbotics-common';

import { Logger } from '#/utils/logger';
import { ProcessGuestService } from './process-guest.service';
import { QueueService } from '../queue.service';
import { GuestService } from '#/database/guest/guest.service';
import { AuthService } from '#/auth/auth.service';
import { AuthSocket } from '#/types';

@Injectable()
export class ProcessWebsocketService {
    private readonly logger = new Logger(ProcessWebsocketService.name);

    constructor(
        private readonly authService: AuthService,
        private readonly processGuestService: ProcessGuestService,
        private readonly guestService: GuestService,
        @Inject(forwardRef(() => QueueService))
        private readonly queueService: QueueService,
    ) {
    }

    public async startProcess(client: AuthSocket, processId: number, input: ProcessInput) {
        const user = await this.authService.validateWebsocketConnection(client);
        const userId = user.id;
        const isUserGuest = this.processGuestService.getIsGuest(user.authorities);
        const initialExecutionsCount = isUserGuest ? await this.processGuestService.getExecutionsCount(userId) : null;
        try {
            this.logger.log(`Checking if user (${userId}) is a guest and can start process ${processId}`);
            await this.processGuestService.checkCanStartProcess(user);

            this.logger.log(`=> Starting process ${processId}`);
            const process = await this.queueService.getProcessById(processId);
            await this.queueService.validateProcessAccess({ process, user });

            const response = await this.queueService.createInstantJob({
                process,
                input,
                user,
                clientId: client.id,
                trigger: { name: TriggerEvent.MANUAL },
                triggerData: { userEmail: user.email }
            });

            const jobIndex = await this.queueService.getPosition(response.id);

            this.logger.log(`<= Process ${processId} successfully started`);

            if(!isUserGuest) return { jobId: response.id, jobIndex };

            await this.guestService.incrementExecutionsCount(userId);
            this.logger.log(`Incremented user's (${userId}) executions-count to ${initialExecutionsCount + 1}`);

            return { jobId: response.id, jobIndex };
        } catch (err: any) {
            this.logger.error(`<= Process ${processId} failed to start`);
            
            if(isUserGuest) {
                await this.guestService.setExecutionsCount(userId, initialExecutionsCount);
                this.logger.log(`Restored user's executions-count to ${initialExecutionsCount}`);
            }

            throw new HttpException({
                message: err?.message ?? 'Internal server error',
                statusCode: err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            }, err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
