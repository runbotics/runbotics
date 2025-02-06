import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTriggerWhitelistItem } from './email-trigger-whitelist-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EmailTriggerWhitelistItem])],
})
export class EmailTriggerWhitelistItemModule {}
