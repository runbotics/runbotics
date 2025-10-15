import { Controller, InternalServerErrorException, Param, Post, UseGuards } from '@nestjs/common';
import { ProcessInstanceSchedulerService } from './process-instance.scheduler.service';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { JwtAuthGuard } from '#/auth/guards';

@Controller('scheduler/process-instances')
export class ProcessInstanceController {
    private readonly logger = new Logger(ProcessInstanceController.name);

    constructor(private processInstanceSchedulerService: ProcessInstanceSchedulerService) {}
    
    @FeatureKeys(FeatureKey.PROCESS_INSTANCE_TERMINATE)
    @Post(':processInstanceId/terminate')
    async startProcess(
        @Param('processInstanceId') processInstanceId: string,
        @UserDecorator() user: User,
    ) {
        try {
            this.logger.log(`=> Terminating process instance ${processInstanceId}`);
            await this.processInstanceSchedulerService.terminateProcessInstance(processInstanceId, user);
            this.logger.log(`<= Process instance ${processInstanceId} successfully terminated`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(error.message);
            }
            this.logger.log(`<= Process instance ${processInstanceId} failed to terminate`, error);
        }
    }
}
