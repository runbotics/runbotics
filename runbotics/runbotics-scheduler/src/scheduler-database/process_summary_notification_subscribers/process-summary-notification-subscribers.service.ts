import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessSummaryNotificationSubscribersEntity } from './process-summary-notification-subscribers.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ProcessStatisticsService } from '#/utils/process-statistics/process-statistics.service';
import { MailService } from '#/mail/mail.service';
import { User } from '../user/user.entity';
import { ProcessStatisticsResult } from '#/types';
import { ProcessEntity } from '../process/process.entity';
import { SubscribeDto } from '#/scheduler-database/process_summary_notification_subscribers/dto/subscribe.dto';
import {
    UpdateSubscriptionDto
} from '#/scheduler-database/process_summary_notification_subscribers/dto/update-subscription.dto';

@Injectable()
export class ProcessSummaryNotificationSubscribersService {
    constructor(
        @InjectRepository(ProcessSummaryNotificationSubscribersEntity)
        private readonly repository: Repository<ProcessSummaryNotificationSubscribersEntity>,
        private readonly processStatisticsService: ProcessStatisticsService,
        private readonly mailService: MailService,
    ) {
    }

    @Cron('0 0 1 * *')
    // @Cron('* * * * *')
    async aggregateAndSendNotifications() {
        const subscribers = await this.getAllSubscribersWithProcesses();

        const emailToProcessesMap: Record<string, { process: ProcessEntity, user: User }[]> = {};

        for (const subscriber of subscribers) {
            const email = subscriber.customEmail || subscriber.user.email;
            if (!emailToProcessesMap[email]) {
                emailToProcessesMap[email] = [];
            }
            emailToProcessesMap[email].push({ process: subscriber.process, user: subscriber.user });
        }

        for (const [email, processesInfo] of Object.entries(emailToProcessesMap)) {
            const processSummaries = [];

            for (const { process, user } of processesInfo) {
                const stats = await this.processStatisticsService.getProcessStatistics(process.id, user);
                processSummaries.push({
                    name: process.name,
                    stats,
                });
            }

            await this.sendAggregatedStatisticsEmail(email, processSummaries);
        }
    }

    private async sendAggregatedStatisticsEmail(
        email: string,
        summaries: { name: string, stats: ProcessStatisticsResult }[],
    ) {
        const htmlContent = this.generateAggregatedEmailContent(summaries);
        console.log(`Sending aggregated email to ${email}`);
        console.log(`Sending aggregated email with content: ${htmlContent}`);
        await this.mailService.sendMail({
            to: email,
            subject: 'Process Summary Notification',
            content: htmlContent,
            isHtml: true,
        });
    }

    private generateAggregatedEmailContent(summaries: { name: string, stats: ProcessStatisticsResult }[]) {
        const content = summaries.map(({ name, stats }) => `
            <h2>Process: ${name}</h2>
            <ul>
                <li>Total Executions: ${stats.totalExecutions}</li>
                <li>Successful Executions: ${stats.successfulExecutions}</li>
                <li>Failed Executions: ${stats.failedExecutions}</li>
                <li>Average Duration (seconds): ${stats.averageDuration}</li>
                <li>Total Duration (seconds): ${stats.totalDuration}</li>
            </ul>
        `).join('');

        return `<h1>Process Summary</h1>${content}`;
    }

    async getAllSubscribersWithProcesses() {
        return this.repository.find({
            relations: ['user', 'process'],
        });
    }

    async getAllSubscribersBaseInformation() {
        return this.repository.find();
    }

    async getSubscribersByProcess(processId: number) {
        return this.repository.find({
            where: { process_id: processId },
        });
    }

    async subscribe(data: SubscribeDto) {
        const result = await this.repository.manager.transaction(async manager => {
            const user = await manager.findOne(User, { where: { id: data.user_id } });
            const process = await manager.findOne(ProcessEntity, { where: { id: data.process_id } });
            if (!user || !process) {
                throw new Error('User or Process not found');
            }
            return manager.save(ProcessSummaryNotificationSubscribersEntity, {
                user,
                process,
                customEmail: data.customEmail ?? '',
            });
        });
        return result;
    }

    async updateSubscription(id: string, data: UpdateSubscriptionDto) {
        const subscriber = await this.repository.findOne({ where: { id } });
        if (!subscriber) {
            throw new Error('Subscriber not found');
        }
        const updatedSubscriber = Object.assign(subscriber, data);
        return this.repository.save(updatedSubscriber);
    }

    async unsubscribe(id: string) {
        return this.repository.delete(id);
    }
}
