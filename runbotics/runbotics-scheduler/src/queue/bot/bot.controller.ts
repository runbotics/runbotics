import {
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpException,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { BotLogService } from '#/websocket/bot/bot-log.service';
import { IBot, FeatureKey, ProcessInstanceStatus, BotStatus } from 'runbotics-common';
import { BotSchedulerService } from './bot.scheduler.service';
import { Logger } from '#/utils/logger';
import { AuthService } from '#/auth/auth.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { BotCrudService } from '#/scheduler-database/bot/bot-crud.service';
import { BotCollectionService } from '#/scheduler-database/bot-collection/bot-collection.service';

@Controller('scheduler/bots')
export class BotController {
    private readonly logger = new Logger(BotController.name);

    constructor(
        private readonly botLogService: BotLogService,
        private readonly botSchedulerService: BotSchedulerService,
        private readonly authService: AuthService,
        private readonly botCrudService: BotCrudService,
        private readonly botCollectionService: BotCollectionService,
        private readonly processInstanceService: ProcessInstanceService,
    ) {}

    @FeatureKeys(FeatureKey.BOT_LOG_READ)
    @Get(':id/logs')
    async getLogs(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Query('lines', ParseIntPipe) lines?: number
    ) {
        await this.botCrudService.findOne(user, id);
        lines = +lines || 100;
        this.logger.log(`=> Getting ${lines ?? ''} logs for bot: ${id}`);
        const logs = await this.botLogService.getLogs(id, lines);
        this.logger.log('<= Logs retrieved successfully');
        return { logs };
    }

    @Get('current-user')
    async isBotConnectedForCurrentUser(
        @UserDecorator() user: User,
    ) {
        this.logger.log(`=> Getting bot status for user: ${user.email}`);
        return await this.botSchedulerService.getBotStatusForUser(user);
    }

    // @Post(':id/configuration')
    // @Roles(Role.ROLE_ADMIN)
    // async configureBot(
    //     @Param('id', ParseIntPipe) id: number,
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     @Body() configuration: Map<string, any>
    // ) {
    //     this.logger.log(`=> Configuring bot ${id}`);
    //     await this.websocketService.sendMessageByBotId(
    //         id,
    //         BotWsMessage.CONFIGURATION,
    //         configuration
    //     );
    //     this.logger.log(`<= Bot ${id} successfully configured`);
    // }

    @FeatureKeys(FeatureKey.BOT_DELETE)
    @Delete(':id')
    async deleteBot(
        @Param('id') id: IBot['id'],
        @UserDecorator() user: User,
    ) {
        this.logger.log(`=> Deleting bot ${id}`);

        const bot = await this.botCrudService.findOne(user, id);
        const installationId = bot.installationId;
        const collectionId = bot.collectionId;

        const isDefaultCollection = await this.botCollectionService.isDefaultCollection(collectionId);
        const isBotConnected = [BotStatus.CONNECTED, BotStatus.BUSY].includes(bot.status);
        if (isDefaultCollection && isBotConnected) {
            throw new ForbiddenException('Cannot delete bot');
        }

        await this.authService.unregisterBot(installationId);

        const botProcessInstances =
            await this.processInstanceService.findAllByBotId(id, user.tenantId);

        botProcessInstances.forEach(async (instance) => {
            if (
                instance.status === ProcessInstanceStatus.IN_PROGRESS ||
                instance.status === ProcessInstanceStatus.INITIALIZING
            ) {
                instance.status = ProcessInstanceStatus.TERMINATED;
                await this.processInstanceService.create(instance);
            }
        });

        return await this.botSchedulerService.deleteById(bot).catch((err) => {
            this.logger.log(`<= Bot ${id} deletion failed`);
            throw new HttpException(err.title, err.status);
        });
    }
}
