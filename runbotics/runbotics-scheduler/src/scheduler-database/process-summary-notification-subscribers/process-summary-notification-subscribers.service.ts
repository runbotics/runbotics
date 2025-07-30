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
import { Logger } from '#/utils/logger';
import { SubscribeDto } from './dto/subscribe.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';


@Injectable()
export class ProcessSummaryNotificationSubscribersService {
    private readonly logger = new Logger(ProcessSummaryNotificationSubscribersService.name);
    constructor(
        @InjectRepository(ProcessSummaryNotificationSubscribersEntity)
        private readonly repository: Repository<ProcessSummaryNotificationSubscribersEntity>,
        private readonly processStatisticsService: ProcessStatisticsService,
        private readonly mailService: MailService,
    ){}

    // executes every 1st of a month
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
        this.logger.log(`Sending aggregated email to ${email}`);
        await this.mailService.sendMail({
            to: email,
            subject: 'Statystyki procesów',
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

    async getAllSubscribersBaseInformation() {
            return this.repository.find();
        }
    
    async getSubscribersByProcess(processId: number) {
        return this.repository.find({
            where: { processId },
            relations: ['user']
        }).then(subscriber => subscriber.map(this.formatToDTO));
    }

    async subscribe(data: SubscribeDto) {
        const result = await this.repository.manager.transaction(async manager => {
            const user = await manager.findOne(User, { where: { id: data.userId } });
            const process = await manager.findOne(ProcessEntity, { where: { id: data.processId } });
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

    private formatToDTO(entity) {
        return {
            id: entity.id,
            createdAt: entity.createdAt,
            userId: entity.userId,
            processId: entity.processId,
            customEmail: entity.customEmail,
            userEmail: entity.user.email,
        };
    }
}
