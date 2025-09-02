import { Injectable } from '@nestjs/common';
import { Logger } from '#/utils/logger';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { UnsubscribeToken } from './unsubscribe-token.entity';
import { Repository } from 'typeorm';
import { ProcessSummaryNotificationSubscribersEntity } from '../process-summary-notification-subscribers/process-summary-notification-subscribers.entity';

@Injectable()
export class UnsubscribeTokenService {
    private readonly logger = new Logger(UnsubscribeTokenService.name);

    constructor(
        @InjectRepository(UnsubscribeToken)
        private unsubscribeTokenRepository: Repository<UnsubscribeToken>,
    ) { }

    async create(email: string): Promise<UnsubscribeToken> {
        this.logger.log(`Creating unsubscribe token for email: ${email}`);
        const token = this.generateUnsubscribeToken();
        const unsubscribeToken = this.unsubscribeTokenRepository.create({ email, token });
        const saved = await this.unsubscribeTokenRepository.save(unsubscribeToken);
        this.logger.log(`Saved token: ${JSON.stringify(saved)}`);
        return saved;
    }

    async findByEmail(email: string): Promise<UnsubscribeToken | undefined> {
        return this.unsubscribeTokenRepository.findOne({ where: { email } });
    }

    async deleteByEmail(email: string): Promise<void> {
        await this.unsubscribeTokenRepository.delete({ email });
    }

    async deleteTokenIfNoSubscriptions(email: string, subscribersRepository: Repository<ProcessSummaryNotificationSubscribersEntity>) {
        const subscriptionsCount = await subscribersRepository.count({
            where: [
                { customEmail: email },
                { user: { email } }
            ],
            relations: ['user']
        });

        if (subscriptionsCount === 0) {
            await this.deleteByEmail(email);
            return true;
        }
        return false;
    }

    async findByToken(token: string): Promise<UnsubscribeToken | undefined> {
        return this.unsubscribeTokenRepository.findOne({ where: { token } });
    }
    
    generateUnsubscribeToken(): string {
        return randomBytes(32).toString('hex');
    }
}