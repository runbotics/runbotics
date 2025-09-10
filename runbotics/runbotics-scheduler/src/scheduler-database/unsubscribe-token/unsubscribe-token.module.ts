import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsubscribeToken } from './unsubscribe-token.entity';
import { UnsubscribeTokenService } from './unsubscribe-token.service';
import { UnsubscribeTokenController } from './unsubscribe-token.controller';
import { ProcessSummaryNotificationSubscribersModule } from '../process-summary-notification-subscribers/process-summary-notification-subscribers.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UnsubscribeToken]), 
        forwardRef(()=>ProcessSummaryNotificationSubscribersModule),
    ],
    exports: [UnsubscribeTokenService],
    providers: [UnsubscribeTokenService],
    controllers: [UnsubscribeTokenController],
})
export class UnsubscribeTokenModule {}
