import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessSummaryNotificationSubscribersEntity } from './process-summary-notification-subscribers.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ProcessStatisticsService } from '#/utils/process-statistics/process-statistics.service';
import { MailService } from '#/mail/mail.service';
import { User } from '../user/user.entity';
import { ProcessStatisticsResult } from '#/types';
import { ProcessEntity } from '../process/process.entity';
import { generateAggregatedEmailContent } from '#/mail/templates/process-summary-notification-statistics.template';


@Injectable()
export class ProcessSummaryNotificationSubscribersService {
    constructor(
        @InjectRepository(ProcessSummaryNotificationSubscribersEntity)
        private readonly repository: Repository<ProcessSummaryNotificationSubscribersEntity>,
        private readonly processStatisticsService: ProcessStatisticsService,
        private readonly mailService: MailService
    ){}

    @Cron('0 0 1 * *')
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
                    stats
                });
            }

            await this.sendAggregatedStatisticsEmail(email, processSummaries);
        }
    }

    private async sendAggregatedStatisticsEmail(email: string, summaries: { name: string, stats: ProcessStatisticsResult }[]) {
        const htmlContent = generateAggregatedEmailContent(summaries);
        console.log(`Sending aggregated email to ${email}`);
        console.log(`Sending aggregated email with content: ${htmlContent}`);
        await this.mailService.sendMail({
            to: email,
            subject: 'Process Summary Notification',
            content: htmlContent,
            isHtml: true,
            attachments: [
                    {
                        path: 'src/mail/assets/Logo.png',
                        filename: 'Logo.png',
                        cid: 'logo',
                    },
                    {
                        path: 'src/mail/assets/assignment_turned_in.svg',
                        filename: 'assignment_turned_in.svg',
                        cid: 'assignment_turned_in',
                    },
                    {
                        path: 'src/mail/assets/assignment_late.svg',
                        filename: 'assignment_late.svg',
                        cid: 'assignment_late',
                    },
                    {
                        path: 'src/mail/assets/schedule.svg',
                        filename: 'schedule.svg',
                        cid: 'schedule',
                    },
                    {
                        path: 'src/mail/assets/more_time.svg',
                        filename: 'more_time.svg',
                        cid: 'more_time',
                    },
                ],
        });
    }

    async getAllSubscribersWithProcesses(){
        return this.repository.find({
            relations: ['user', 'process']
        });
    }
}
