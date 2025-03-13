import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    MessageBody,
    SubscribeMessage,
    ConnectedSocket,
    WebSocketServer,

} from '@nestjs/websockets';
import { HttpStatus, OnModuleInit, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '#/utils/logger';
import { AuthService } from '#/auth/auth.service';
import { BotLogService } from './bot-log.service';
import { BotProcessService } from '#/websocket/bot/process-launch/bot-process-instance.service';
import {
    BotStatus, BotWsMessage, IBot,
    IProcessInstance, IProcessInstanceEvent,
    IProcessInstanceLoopEvent, ProcessInstanceEventStatus,
    ProcessInstanceStatus, User, WsMessage
} from 'runbotics-common';
import { BotProcessEventService } from '#/websocket/bot/process-launch/bot-process-instance-event.service';
import { BotAuthSocket } from '#/types/auth-socket';
import { WsBotJwtGuard } from '#/auth/guards';
import { UiGateway } from '../ui/ui.gateway';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { GuestService } from '#/scheduler-database/guest/guest.service';
import { MailService } from '#/mail/mail.service';
import { ProcessService } from '#/scheduler-database/process/process.service';

@WebSocketGateway({ path: '/ws-bot', cors: { origin: '*' } })
export class BotWebSocketGateway implements OnGatewayDisconnect, OnGatewayConnection, OnModuleInit {
    private logger: Logger = new Logger(BotWebSocketGateway.name);
    @WebSocketServer() server: Server;
    private CONNECTION_TIMEOUT = 60_000;

    constructor(
        private readonly authService: AuthService,
        private readonly botProcessService: BotProcessService,
        private readonly botLogService: BotLogService,
        private readonly botProcessEventService: BotProcessEventService,
        private readonly uiGateway: UiGateway,
        private readonly botService: BotService,
        private readonly guestService: GuestService,
        private readonly mailService: MailService,
        private readonly processService: ProcessService,
    ) {}

    onModuleInit() {
        if (this.server && this.server.engine) {
            this.server.engine.opts.maxHttpBufferSize = 2_000_000;
            // this.server.engine.opts.transports = ['websocket'];
        }
    }

    async handleConnection(client: Socket) {
        this.logger.log(`Bot ${client.id} is trying to establish connection`);
        const connectionTimeout = this.setConnectionTimeout(client);

        const validationResponse = await this.authService.validateBotWebsocketConnection({client});
        clearTimeout(connectionTimeout);

        if (validationResponse !== null && validationResponse !== undefined) {
            const { bot } = validationResponse as { bot: IBot, user: User };
            const tenantRoom = bot.tenantId;
            this.uiGateway.emitTenant(tenantRoom, WsMessage.BOT_STATUS, bot);

            this.logger.log(`Bot connected: ${bot.installationId} | ${client.id}`);

            client.join(bot.installationId);
        }
    }

    async handleDisconnect(client: Socket) {
        const installationId = client.handshake.auth.installationId;
        const botExists = await this.botService.findByInstallationId(installationId);

        if (!botExists) return;

        const bot = await this.authService.unregisterBot(installationId as string);

        const tenantRoom = bot.tenantId;
        this.uiGateway.emitTenant(tenantRoom, WsMessage.BOT_STATUS, bot);

        // await this.botLifecycleService.handleProcessInstanceInterruption(bot);

        this.logger.log(`Bot disconnected: ${installationId} | ${client.id}`);

        await this.mailService.sendBotDisconnectionNotificationMail(bot, installationId);
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE)
    async processListener(
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstance: IProcessInstance,
        ) {
        const installationId = socket.bot.installationId;
        this.logger.log(`=> Updating process-instance (${processInstance.id}) by bot (${installationId}) | status: ${processInstance.status}`);

        if (processInstance.status === ProcessInstanceStatus.IN_PROGRESS ||
            processInstance.status === ProcessInstanceStatus.INITIALIZING) {
            await this.setBotStatusBusy(socket.bot);
        }

        await this.botProcessService.updateProcessInstanceAndNotify(installationId, processInstance);

        if(
            processInstance.status === ProcessInstanceStatus.ERRORED ||
            processInstance.status === ProcessInstanceStatus.TERMINATED
        ) {
            await this.botProcessEventService.setEventStatusesAlikeInstance(socket.bot, processInstance);
            await this.guestService.decrementExecutionsCount(processInstance.user.id);
            this.logger.log('Restored user\'s executions-count because of process interruption');
        }

        await this.handleProcessInstanceNotification(processInstance);

        this.logger.log(`<= Success: process-instance (${processInstance.id}) updated by bot (${installationId}) | status: ${processInstance.status}`);

        return HttpStatus.OK;
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE_EVENT)
    async processInstanceEventListener(
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstanceEvent: IProcessInstanceEvent,
    ) {
        if(processInstanceEvent.status !== ProcessInstanceEventStatus.IN_PROGRESS){
            this.updateProcessInstanceEvent(socket.bot, processInstanceEvent);
            return;
        } else {
            await this.setBotStatusBusy(socket.bot);
        }

        setTimeout(() => this.updateProcessInstanceEvent(socket.bot, processInstanceEvent), 500);

       return HttpStatus.OK;
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT)
    async processInstanceLoopEventListener(
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstanceEvent: IProcessInstanceLoopEvent,
    ) {
        if (processInstanceEvent.status === ProcessInstanceEventStatus.IN_PROGRESS) {
            await this.setBotStatusBusy(socket.bot);
        }

        const installationId = socket.bot.installationId;
        this.logger.log(`=> Updating process-instance-loop-event (${processInstanceEvent.executionId}) by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
        await this.botProcessEventService.updateProcessInstanceLoopEvent(processInstanceEvent, socket.bot);
        this.logger.log(`<= Success: process-instance-loop-event (${processInstanceEvent.executionId}) updated by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);

        return HttpStatus.OK;
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.LOG)
    onEvent(
        @ConnectedSocket() client: BotAuthSocket,
        @MessageBody() logs: string,
    ) {
        const installationId = client.bot.installationId;
        this.logger.log(`=> Saving logs from bot ${installationId} in a file`);
        this.botLogService.writeLogsToFile(client.bot.id, logs);
        this.logger.log(`<= Success: logs from bot ${installationId} saved`);
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.KEEP_ALIVE)
    async processKeepAliveEventListener(
        @ConnectedSocket() socket: BotAuthSocket,
    ) {
        await this.botService.updateConnectedBotStatus(socket.bot.id);
    }

    async updateProcessInstanceEvent(bot: IBot, processInstanceEvent: IProcessInstanceEvent) {
        const installationId = bot.installationId;
        this.logger.log(`=> Updating process-instance-event (${processInstanceEvent.executionId}) by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
        await this.botProcessEventService.updateProcessInstanceEvent(processInstanceEvent, bot);
        this.logger.log(`<= Success: process-instance-event (${processInstanceEvent.executionId}) updated by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
    }

    async setBotStatusBusy(bot: IBot) {
        const busyBotStatus = BotStatus.BUSY;
        const tenantRoom = bot.tenantId;
        if (bot.status !== busyBotStatus) {
            this.logger.log(`Updating bot ${bot.installationId} status to (${busyBotStatus})`);
            await this.botService.setBusy(bot);
            this.uiGateway.emitTenant(tenantRoom, WsMessage.BOT_STATUS, bot);
            this.logger.log('Success: bot status updated');
        }
    }

    private setConnectionTimeout(client: Socket) {
        return setTimeout(() => {
            this.logger.log(`Connection timeout reached (${(this.CONNECTION_TIMEOUT / 1_000)}s). Bot is disconnecting...`);
            if (client) {
                client.disconnect();
            }
        }, this.CONNECTION_TIMEOUT);
    }

    private async handleProcessInstanceNotification(processInstance: IProcessInstance) {
        if (processInstance.status === ProcessInstanceStatus.ERRORED) {
            const process = await this.processService.findById(processInstance.process.id);

            await this.mailService.sendProcessFailureNotificationMail(process, processInstance);
        }

        if (processInstance?.callbackUrl) {
            await this.botProcessService.notifyAboutProcessInstanceStatus(processInstance);
        }
    }
}
