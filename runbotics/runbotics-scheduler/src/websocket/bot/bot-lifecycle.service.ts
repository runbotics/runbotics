import { Injectable } from '@nestjs/common';
import { IBot, ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';
import { ProcessInstanceService } from 'src/database/process-instance/process-instance.service';
import { Logger } from 'src/utils/logger';
import { BotProcessEventService } from './process-launch/bot-process-instance-event.service';
import { ProcessInstanceEventService } from '#/database/process-instance-event/process-instance-event.service';

@Injectable()
export class BotLifecycleService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly botProcessEventService: BotProcessEventService,
    ) { }
    
    private readonly logger = new Logger(BotLifecycleService.name);

    async handleInterruptedProcessInstanceExecution(bot: IBot): Promise<void> {
        const disconnectedBotProcessInstances = await this.processInstanceService.findAllByBotId(bot.id);
        disconnectedBotProcessInstances.forEach(async (processInstance) => {
            if (
                processInstance.status !== ProcessInstanceStatus.INITIALIZING &&
                processInstance.status !== ProcessInstanceStatus.IN_PROGRESS
            ) return;

            const newProcessInstance = { 
                ...processInstance,
                status: ProcessInstanceStatus.ERRORED,
                error: 'Bot has been shut down',
            };

            await this.processInstanceService.save(newProcessInstance)
                .then(() => {
                    this.logger.log(
                        `<= Success: process-instance (${
                            newProcessInstance.id
                        }) updated after bot disconnection | status: ${
                            newProcessInstance.status
                        }, error message: "${
                            newProcessInstance.error
                        }"`
                    );
                })
                .catch((err) => {
                    this.logger.log(`<= Error: process-instance (${newProcessInstance.id}) update after bot disconnection failed | Error: ${err}`);
                });

            this.handleInterruptedProcessInstanceEvent(bot, processInstance.id);
        });
    }

    private async handleInterruptedProcessInstanceEvent (bot: IBot, processInstanceId: string): Promise<void> {
        const activeProcessInstanceEvents = this.processInstanceEventService.findActiveByProcessInstanceId(processInstanceId);
        const newProcessInstanceEvent = {
            ...activeProcessInstanceEvents,
            status: ProcessInstanceEventStatus.ERRORED,
            error: 'Bot has been shut down',
        };

        this.botProcessEventService.updateProcessInstanceEvent(newProcessInstanceEvent, bot);
    }
}
