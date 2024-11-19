import {
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    ParseIntPipe,
    Query,
    Req,
} from '@nestjs/common';
import { BotLogService } from '#/websocket/bot/bot-log.service';
import { IBot, FeatureKey, ProcessInstanceStatus } from 'runbotics-common';
import { BotSchedulerService } from './bot.scheduler.service';
import { Logger } from '#/utils/logger';
import { AuthService } from '#/auth/auth.service';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';

@Controller('scheduler/bots')
export class BotController {
    private readonly logger = new Logger(BotController.name);

    constructor(
        private readonly botLogService: BotLogService,
        private readonly botSchedulerService: BotSchedulerService,
        private readonly authService: AuthService,
        private readonly botService: BotService,
        private readonly processInstanceService: ProcessInstanceService,
    ) {}

    @FeatureKeys(FeatureKey.BOT_LOG_READ)
    @Get(':id/logs')
    async getLogs(
        @Param('id', ParseIntPipe) id: number,
        @Query('lines', ParseIntPipe) lines?: number
    ) {
        lines = +lines || 100;
        this.logger.log(`=> Getting ${lines ?? ''} logs for bot: ${id}`);
        const logs = await this.botLogService.getLogs(id, lines);
        this.logger.log('<= Logs retrieved successfully');
        return { logs };
    }

    @Get('current-user')
    async isBotConnectedForCurrentUser(@Req() request) {
        this.logger.log(`=> Getting bot status for user: ${request.user.login}`);
        return await this.botSchedulerService.getBotStatusForUser(request.user);
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
    async deleteBot(@Param('id') id: IBot['id'], @UserDecorator() user: User) {
        this.logger.log(`=> Deleting bot ${id}`);

        const bot = await this.botService.findById(id);
        const installationId = bot.installationId;

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

        return await this.botSchedulerService.deleteById(id).catch((err) => {
            this.logger.log(`<= Bot ${id} deletion failed`);
            throw new HttpException(err.title, err.status);
        });
    }
}
