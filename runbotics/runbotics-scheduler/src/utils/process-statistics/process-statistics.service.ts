import { ProcessInstanceEventService } from '#/scheduler-database/process-instance-event/process-instance-event.service';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { User } from '#/scheduler-database/user/user.entity';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {ProcessStatisticsResult} from '#/types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';


interface ProcessStatisticsAccumulator {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    totalDuration: number;
    countedExecutions: number;
}

@Injectable()
export class ProcessStatisticsService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
    ) {
        dayjs.extend(isBetween);
    }
    
    public async getProcessStatistics(processId: number, user: User, fromDate?: Date, toDate?: Date): Promise<ProcessStatisticsResult> {
        const { finalFromDate, finalToDate } = this.createDateParams(fromDate, toDate);
        const stats = await this.calculateStatistics(processId, user, finalFromDate, finalToDate);
        return this.formatStatistics(stats);
    }

    private createDateParams(fromDate?: Date, toDate?: Date) {
        const now = dayjs();
        const finalToDate = dayjs(toDate ?? now);
        const finalFromDate = dayjs(fromDate ?? now.subtract(1, 'month'));
        if(finalToDate < finalFromDate) {
            throw new Error('ToDate cannot be earlier than FromDate');
        }
        return { finalFromDate, finalToDate };
    }
    
    private async calculateStatistics(processId: number, user: User, finalFromDate: dayjs.Dayjs, finalToDate: dayjs.Dayjs){
        const processInstances = await this.processInstanceService.findAllByProcessId(processId, user);
        return (await Promise.all(processInstances.map(async (instance) => {
            const events = await this.processInstanceEventService.findAllByProcessInstanceId(instance.id);
            const finishedEvents = events.filter(e => 
                e.created && e.finished && dayjs(e.created).isBetween(finalFromDate, finalToDate, null, '[]')
            );
            return {instance, finishedEvents};
        }))).reduce((acc, {instance, finishedEvents}) => {
            if(finishedEvents.length > 0) {
                acc.totalExecutions++;
                if(instance.status === 'COMPLETED') acc.successfulExecutions++;
                if(instance.status === 'ERRORED') acc.failedExecutions++;
                for(const event of finishedEvents) {
                    const duration = new Date(event.finished).getTime() - new Date(event.created).getTime();
                    acc.totalDuration += duration;
                    acc.countedExecutions++;
                }
            }
            return acc;
        }, {
            totalExecutions: 0,
            successfulExecutions: 0,
            failedExecutions: 0,
            totalDuration: 0,
            countedExecutions: 0
        });
    }

    private formatStatistics(stats: ProcessStatisticsAccumulator): ProcessStatisticsResult {
        const averageDuration = stats.countedExecutions > 0 ? stats.totalDuration / stats.countedExecutions : 0;
        return {
            totalExecutions: stats.totalExecutions,
            successfulExecutions: stats.successfulExecutions,
            failedExecutions: stats.failedExecutions,
            averageDuration: Number((averageDuration / 1000).toFixed(2)),
            totalDuration: Number((stats.totalDuration / 1000).toFixed(2))
        };
    }
}
