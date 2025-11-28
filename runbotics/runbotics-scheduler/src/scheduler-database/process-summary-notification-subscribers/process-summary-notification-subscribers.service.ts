import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessSummaryNotificationSubscribersEntity } from './process-summary-notification-subscribers.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ProcessStatisticsService } from '#/utils/process-statistics/process-statistics.service';
import { MailService } from '#/mail/mail.service';
import { User } from '../user/user.entity';
import { ProcessEntity } from '../process/process.entity';
import { Logger } from '#/utils/logger';
import { SubscribeDto } from './dto/subscribe.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UnsubscribeTokenService } from '../unsubscribe-token/unsubscribe-token.service';


@Injectable()
export class ProcessSummaryNotificationSubscribersService {
    private readonly logger = new Logger(ProcessSummaryNotificationSubscribersService.name);
    constructor(
        @InjectRepository(ProcessSummaryNotificationSubscribersEntity)
        private readonly repository: Repository<ProcessSummaryNotificationSubscribersEntity>,
        private readonly processStatisticsService: ProcessStatisticsService,
        private readonly mailService: MailService,
        private readonly unsubscribeTokenService: UnsubscribeTokenService,
    ){}

    @Cron(process.env.PROCESS_SUMMARY_CRON || '0 0 1 * *')
    async aggregateAndSendNotifications() {
        const subscribers = await this.getAllSubscribersWithProcesses();

        const emailToProcessesMap: Record<string, { process: ProcessEntity, user: User }[]> = {};

        for (const subscriber of subscribers) {
            const email = subscriber.customEmail?.toLocaleLowerCase() || subscriber.user.email.toLocaleLowerCase();
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
            const unsubscribeToken = await this.unsubscribeTokenService.findByEmail(email);
            const unsubscribeUrl = unsubscribeToken
                ? `${process.env.RUNBOTICS_ENTRYPOINT_URL}/api/scheduler/unsubscribe?token=${unsubscribeToken.token}`
                : '';

            await this.mailService.sendProcessSummaryNotification(processSummaries, unsubscribeUrl, [email]);
        }
    }

    async unsubscribeAllByEmail(email: string) {
        const subscribers = await this.repository.find({
            where: [
                { customEmail: email },
                { user: { email } }
            ],
            relations: ['user']
        }); 
        if (subscribers.length === 0) {
            throw new NotFoundException('No subscriptions found for this email');
        }
        for (const subscriber of subscribers) {
            await this.repository.delete(subscriber.id);
        }
        const deleted = await this.unsubscribeTokenService.deleteTokenIfNoSubscriptions(email, this.repository);
        if (!deleted) {
            this.logger.warn(`Token for ${email} was not deleted despite no subscriptions`);
        }
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
            if(!user) {
                throw new NotFoundException('User not found');
            }
            if (!process) {
                throw new NotFoundException('Process not found');
            }

            const email = (data.customEmail ? data.customEmail : user.email).toLowerCase();
            const existingToken = await this.unsubscribeTokenService.findByEmail(email);
            if (!existingToken) {
                await this.unsubscribeTokenService.create(email);
            }

            return manager.save(ProcessSummaryNotificationSubscribersEntity, {
                user,
                process,
                customEmail: data.customEmail ? data.customEmail.toLowerCase() : '',
            });
        });
        return result;
    }

    async updateSubscription(id: string, data: UpdateSubscriptionDto) {
        const subscriber = await this.repository.findOne({ where: { id } });
        if (!subscriber) {
            throw new NotFoundException('Subscriber not found');
        }
        const updatedSubscriber = Object.assign(subscriber, data);
        return this.repository.save(updatedSubscriber);
    }

    async unsubscribe(id: string) {
        const subscriber = await this.repository.findOne({ where: { id }, relations: ['user'] });
        if (!subscriber) {
            throw new NotFoundException('Subscriber not found');
        }

        const email = subscriber.customEmail?.toLowerCase() || subscriber.user.email.toLowerCase();

        await this.repository.delete(id);

        await this.unsubscribeTokenService.deleteTokenIfNoSubscriptions(email, this.repository);

        return { success: true };
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
