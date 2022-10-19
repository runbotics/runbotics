import { Controller, Param, Post } from '@nestjs/common';
import { ProcessInstanceSchedulerService } from './process-instance.scheduler.service';
import { Logger } from 'src/utils/logger';
import { FeatureKeys } from 'src/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';

@Controller('scheduler/process-instances')
export class ProcessInstanceController {
    private readonly logger = new Logger(ProcessInstanceController.name);

    constructor(private processInstanceSchedulerService: ProcessInstanceSchedulerService) {}

    @FeatureKeys(FeatureKey.PROCESS_INSTANCE_TERMINATE)
    @Post(':processInstanceId/terminate')
    async startProcess(
        @Param('processInstanceId') processInstanceId: string
    ) {
        this.logger.log(`=> Terminating process instance ${processInstanceId}`);
        await this.processInstanceSchedulerService.terminateProcessInstance(processInstanceId);
        this.logger.log(`<= Process instance ${processInstanceId} successfully terminated`);
    }
}