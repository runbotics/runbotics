import { Module } from '@nestjs/common';
import { ActionBlacklist } from '#/scheduler-database/action-blacklist/action-blacklist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionBlacklistController } from '#/scheduler-database/action-blacklist/action-blacklist.controller';
import { ActionBlacklistService } from '#/scheduler-database/action-blacklist/action-blacklist.service';

@Module({
    imports: [TypeOrmModule.forFeature([ActionBlacklist])],
    controllers: [ActionBlacklistController],
    providers: [ActionBlacklistService],
})
export class ActionBlacklistModule {
}
