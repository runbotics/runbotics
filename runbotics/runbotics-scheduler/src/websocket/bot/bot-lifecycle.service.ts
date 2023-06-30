import { Injectable, NotFoundException } from '@nestjs/common';
import { IBot, IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';
import { ProcessInstanceService } from 'src/database/process-instance/process-instance.service';
import { Logger } from 'src/utils/logger';
import { ProcessInstanceEventService } from '#/database/process-instance-event/process-instance-event.service';
import { BotProcessEventService } from './process-launch/bot-process-instance-event.service';
import { BotProcessService } from './process-launch/bot-process-instance.service';

@Injectable()
export class BotLifecycleService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly botProcessEventService: BotProcessEventService,
        private readonly botProcessService: BotProcessService,
    ) { }
    
    private readonly logger = new Logger(BotLifecycleService.name);

    async handleProcessInstanceInterruption(bot: IBot): Promise<void> {
        const disconnectedInstances: IProcessInstance[] = 
            await this.processInstanceService.findActiveByBotId(bot.id)
                .catch(() => {
                    this.logger.error(`Not found process-instances for bot (${bot.id})`);
                    throw new NotFoundException(`Not found process-instances for bot (${bot.id})`);
                });

        if(disconnectedInstances.length === 0) return;

        disconnectedInstances.forEach(async (disconnectedInstance) => {
            if (
                disconnectedInstance.status !== ProcessInstanceStatus.INITIALIZING &&
                disconnectedInstance.status !== ProcessInstanceStatus.IN_PROGRESS
            ) return;
            
            const completeProcessInstance: IProcessInstance =
                await this.processInstanceService
                    .findById(disconnectedInstance.id)
                    .then(processInstance => processInstance)
                    .catch(error => {
                        this.logger.error(`Error getting processInstance: ${error}`);
                        return null;
                    });
                
            const newProcessInstance: IProcessInstance = {
                ...completeProcessInstance,
                status: ProcessInstanceStatus.ERRORED, 
                error: 'Bot has been shut down',
                updated: new Date().toString(),
            };

            this.updateInterruptedProcessInstance(newProcessInstance, bot.installationId);            
            this.handleProcessInstanceEventInterruption(disconnectedInstance, bot);
        });
    }

    private async handleProcessInstanceEventInterruption (processInstance: IProcessInstance, bot: IBot): Promise<void> {
        const activeEvents: IProcessInstanceEvent[] = 
            await this.processInstanceEventService
                .findActiveByProcessInstanceId(processInstance.id);
                
        if(!activeEvents) return;

        await activeEvents.forEach(async event => {
            const newProcessInstanceEvent: IProcessInstanceEvent = {
                ...event, 
                status: ProcessInstanceEventStatus.ERRORED, 
                error: 'Bot has been shut down',
                finished: processInstance.updated,
                processInstance,
            };
            await this.updateInterruptedProcessInstanceEvent(newProcessInstanceEvent, bot);
        });
    }

    private async updateInterruptedProcessInstance(processInstance: IProcessInstance, installationId: string) {
        this.logger.log(`Updating interrupted process-instance (${processInstance.id}) after bot disconnection | status: ${processInstance.status}`);
        await this.botProcessService.updateProcessInstance(installationId, processInstance);
        this.logger.log(`Success interrupted process-instance (${processInstance.id}) updated | status: ${processInstance.status}`);
    }
    
    private async updateInterruptedProcessInstanceEvent(processInstanceEvent: IProcessInstanceEvent, bot: IBot) {
        this.logger.log(`Updating interrupted process-instance-event (${processInstanceEvent.id}) | status: ${processInstanceEvent.status}`);
        await this.botProcessEventService.updateProcessInstanceEvent(processInstanceEvent, bot);
        this.logger.log(`Success interrupted process-instance-event (${processInstanceEvent.id}) updated | status: ${processInstanceEvent.status}`);
    }
}
