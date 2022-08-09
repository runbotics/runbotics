import {
    Body,
    Controller,
    Delete,
    Get, HttpException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { BotLogService } from 'src/websocket/bot-log/bot-log.service';
import { BotWsMessage, IBot, FeatureKey, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { WebsocketService } from 'src/websocket/websocket.service';
import { BotSchedulerService } from './bot.scheduler.service';
import { Logger } from 'src/utils/logger';
import { AuthService } from 'src/auth/auth.service';
import { BotService } from '../../database/bot/bot.service';
import { ProcessInstanceService } from 'src/database/process_instance/process_instance.service';
import { FeatureKeys } from 'src/auth/featureKey.decorator';


@Controller('scheduler/bots')
export class BotController {
    private readonly logger = new Logger(BotController.name);

    constructor(
        private readonly botLogService: BotLogService,
        private readonly websocketService: WebsocketService,
        private readonly BotSchedulerService: BotSchedulerService,
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
        lines = +lines || 100
        this.logger.log(`=> Getting ${lines ?? ''} logs for bot: ${id}`);
        const logs = await this.botLogService.getLogs(id, lines);
        this.logger.log('<= Logs retrieved successfully');
        return { logs };
    }

    @Get('current-user')
    async isBotConnectedForCurrentUser(@Req() request) {
        this.logger.log(`=> Getting bot status for user: ${request.user.login}`);
        return await this.BotSchedulerService.getBotStatusForUser(request.user);
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
    async deleteBot(@Param('id') id: IBot['id']) {
        this.logger.log(`=> Deleting bot ${id}`);

        const bot = (await this.botService.findById(id));
        const installationId = bot.installationId;

        await this.authService.unregisterBot(installationId);

        const botProcessInstances = await this.processInstanceService.findAllByBotId(id);

        botProcessInstances.forEach(async instance => {
            if (instance.status === ProcessInstanceStatus.IN_PROGRESS
                || instance.status === ProcessInstanceStatus.INITIALIZING
            ) {
                instance.status = ProcessInstanceStatus.TERMINATED;
                const updated = await this.processInstanceService.save(instance);
            }
        });

        return await this.BotSchedulerService.deleteById(id).catch((err) => {
            this.logger.log(`<= Bot ${id} deletion failed`);
            throw new HttpException(err.title, err.status);
        });
    }
}
