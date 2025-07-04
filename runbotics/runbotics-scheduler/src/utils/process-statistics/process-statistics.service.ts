import { ProcessInstanceEventService } from '#/scheduler-database/process-instance-event/process-instance-event.service';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { User } from '#/scheduler-database/user/user.entity';
import { Injectable } from '@nestjs/common';
import {ProcessStatisticsResult} from '#/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

@Injectable()
export class ProcessStatisticsService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
    ) { }
    
    public async getProcessStatistics(processId: number, user: User, fromDate?: Date, toDate?: Date): Promise<ProcessStatisticsResult> {
        dayjs.extend(isBetween);
        
        const now = dayjs();
        const finalToDate = dayjs(toDate ?? now);
        const finalFromDate = dayjs(fromDate ?? now.subtract(1, 'month'));
        if (finalToDate < finalFromDate) {
            throw new Error('ToDate cannot be earlier than FromDate');
        }
        
        const processInstances = await this.processInstanceService.findAllByProcessId(processId, user);
        
        let totalDuration = 0;
        let countedExecutions = 0;
        const filteredInstances = [];
        
        for (const instance of processInstances){
            const events = await this.processInstanceEventService.findAllByProcessInstanceId(instance.id);
            const finishedEvents = events.filter(e =>
                e.created && e.finished &&
                dayjs(e.created).isBetween(finalFromDate, finalToDate, null, '[]')
            );
            if (finishedEvents.length > 0) {
                filteredInstances.push(instance);
                for (const event of finishedEvents) {
                    const duration = new Date(event.finished).getTime() - new Date(event.created).getTime();
                    totalDuration += duration;
                    countedExecutions++;
                }
            }
        }
        
        const totalExecutions = filteredInstances.length;
        const successfulExecutions = filteredInstances.filter(i => i.status === 'COMPLETED').length;
        const failedExecutions = filteredInstances.filter(i => i.status === 'ERRORED').length;
        const averageDuration = countedExecutions > 0 ? totalDuration / countedExecutions : 0;
        
        return {
            totalExecutions,
            successfulExecutions,
            failedExecutions,
            averageDuration: Number((averageDuration / 1000).toFixed(2)),
            totalDuration: Number((totalDuration / 1000).toFixed(2))
        };
    }
}
