import { Injectable } from '@nestjs/common';
import { IBot, ProcessInstanceStatus } from 'runbotics-common';
import { ProcessInstanceService } from 'src/database/process-instance/process-instance.service';
import { Logger } from 'src/utils/logger';
import { ProcessInstanceEventService } from '#/database/process-instance-event/process-instance-event.service';

@Injectable()
export class BotLifecycleService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
    ) { }
    
    private readonly logger = new Logger(BotLifecycleService.name);

    private setInfoPropsAfterBotDisconnection(process) {
        return {
            ...process, 
            status: ProcessInstanceStatus.ERRORED, 
            error: 'Bot has been shut down'
        };
    }

    async handleInterruptedProcessInstanceExecution(bot: IBot): Promise<void> {
        const disconnectedBotProcessInstances = await this.processInstanceService.findAllByBotId(bot.id);
        disconnectedBotProcessInstances.forEach(async (processInstance) => {
            if (
                processInstance.status !== ProcessInstanceStatus.INITIALIZING &&
                processInstance.status !== ProcessInstanceStatus.IN_PROGRESS
            ) return;

            const newProcessInstance = this.setInfoPropsAfterBotDisconnection(processInstance);

            await this.updateInterruptedProcessInstance(newProcessInstance);            

            this.handleInterruptedProcessInstanceEvent(processInstance.id);
        });
    }

    private async handleInterruptedProcessInstanceEvent (processInstanceId: string): Promise<void> {
        const activeEvents = await this.processInstanceEventService.findActiveByProcessInstanceId(processInstanceId);

        if(!activeEvents) return;

        activeEvents.forEach(async event => {
            const newProcessInstanceEvent = this.setInfoPropsAfterBotDisconnection(event);

            await this.updateInterruptedProcessInstanceEvent(newProcessInstanceEvent);
        });

    }

    private async updateInterruptedProcessInstance(newProcessInstance) {
        this.logger.log(
            `<= Success process-instance (${
                newProcessInstance.id
            }) has been updated after bot disconnection | status: ${
                newProcessInstance.status
            }, error message: "${
                newProcessInstance.error
            }"`
        );

        await this.processInstanceService.save(newProcessInstance);

        this.logger.log(
            `=> Updating process-instance (${
                newProcessInstance.id
            }) updated after bot disconnection | status: ${
                newProcessInstance.status
            }, error message: "${
                newProcessInstance.error
            }"`
        );
    }

    private async updateInterruptedProcessInstanceEvent(newProcessInstanceEvent) {
        this.logger.log(
            `=> Updating process-instance (${
                newProcessInstanceEvent.id
            }) updated after bot disconnection | status: ${
                newProcessInstanceEvent.status
            }, error message: "${
                newProcessInstanceEvent.error
            }"`
        );
            
        await this.processInstanceEventService.update(newProcessInstanceEvent);
            
        this.logger.log(
            `<= Success process-instance-event (${
                newProcessInstanceEvent.id
            }) has been updated after bot disconnection | status: ${
                newProcessInstanceEvent.status
            }, error message: "${
                newProcessInstanceEvent.error
            }"`
        );
    }
}
