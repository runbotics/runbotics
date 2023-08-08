import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    MessageBody,
    SubscribeMessage,
    ConnectedSocket,
    WebSocketServer,

} from '@nestjs/websockets';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '#/utils/logger';
import { AuthService } from '#/auth/auth.service';
import { BotLogService } from './bot-log.service';
import { BotProcessService } from '#/websocket/bot/process-launch/bot-process-instance.service';
import { BotStatus, BotWsMessage, IBot, IProcessInstance, IProcessInstanceEvent, IProcessInstanceLoopEvent, ProcessInstanceEventStatus, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { BotProcessEventService } from '#/websocket/bot/process-launch/bot-process-instance-event.service';
import { BotAuthSocket } from '#/types/auth-socket';
import { WsBotJwtGuard } from '#/auth/guards';
import { UiGateway } from '../ui/ui.gateway';
import { BotService } from '#/database/bot/bot.service';
import { BotLifecycleService } from './bot-lifecycle.service';
import { GuestService } from '#/database/guest/guest.service';

@WebSocketGateway({ path: '/ws-bot', cors: { origin: '*' } })
export class BotWebSocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private logger: Logger = new Logger(BotWebSocketGateway.name);
    @WebSocketServer() server: Server;

    constructor(
        private readonly authService: AuthService,
        private readonly botProcessService: BotProcessService,
        private readonly botLogService: BotLogService,
        private readonly botProcessEventService: BotProcessEventService,
        private readonly uiGateway: UiGateway,
        private readonly botService: BotService,
        private readonly botLifecycleService: BotLifecycleService,
        private readonly guestService: GuestService,
    ) { }

    async handleConnection(client: Socket) {
        this.logger.log(`Bot ${client.id} is trying to establish connection`);

        const { bot } = await this.authService.validateBotWebsocketConnection({ client });

        this.uiGateway.server.emit(WsMessage.BOT_STATUS, bot);

        this.logger.log(`Bot connected: ${bot.installationId} | ${client.id}`);
        client.join(bot.installationId);
    }

    async handleDisconnect(client: Socket) {
        const installationId = client.handshake.auth.installationId;
        const botExists = await !!this.botService.findByInstallationId(installationId);

        if (!botExists) return;
        
        const bot = await this.authService.unregisterBot(installationId as string);
        
        this.uiGateway.server.emit(WsMessage.BOT_STATUS, bot);

        this.botLifecycleService.handleProcessInstanceInterruption(bot);

        this.logger.log(`Bot disconnected: ${installationId} | ${client.id}`);
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.RUNNING_PROCESS)
    async runningProcessListener( 
        @ConnectedSocket() socket: BotAuthSocket,
    ) {
        this.logger.log('<= Process is already running');
        this.setBotStatusBusy(socket.bot);
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE)
    async processListener( 
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstance: IProcessInstance,
    ) {
        await this.setBotStatusBusy(socket.bot);

        const installationId = socket.bot.installationId;

        this.logger.log(`=> Updating process-instance (${processInstance.id}) by bot (${installationId}) | status: ${processInstance.status}`);
        await this.botProcessService.updateProcessInstance(installationId, processInstance);

        if(
            processInstance.status === ProcessInstanceStatus.ERRORED ||
            processInstance.status === ProcessInstanceStatus.TERMINATED
        ) {
            await this.botProcessEventService.setEventStatusesAlikeInstance(socket.bot, processInstance);
            await this.guestService.decrementExecutionsCount(processInstance.user.id);
            this.logger.log('Restored user\'s executions-count because of process interruption');
        }

        this.logger.log(`<= Success: process-instance (${processInstance.id}) updated by bot (${installationId}) | status: ${processInstance.status}`);

        return HttpStatus.OK;
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE_EVENT)
    async processInstanceEventListener(
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstanceEvent: IProcessInstanceEvent,
    ) {
        await this.setBotStatusBusy(socket.bot);

        if(processInstanceEvent.status !== ProcessInstanceEventStatus.IN_PROGRESS){
            this.updateProcessInstanceEvent(socket.bot, processInstanceEvent);
            return;
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
        await this.setBotStatusBusy(socket.bot);
        
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

    async updateProcessInstanceEvent(bot: IBot, processInstanceEvent: IProcessInstanceEvent) {
        const installationId = bot.installationId;
        this.logger.log(`=> Updating process-instance-event (${processInstanceEvent.executionId}) by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
        await this.botProcessEventService.updateProcessInstanceEvent(processInstanceEvent, bot);
        this.logger.log(`<= Success: process-instance-event (${processInstanceEvent.executionId}) updated by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
    }

    private async setBotStatusBusy(bot: IBot) {
        const busyBotStatus = BotStatus.BUSY;
        if (bot.status !== busyBotStatus) {
            this.logger.log(`Updating bot status to (${busyBotStatus})`);
            await this.botService.setBusy(bot);
            this.uiGateway.server.emit(WsMessage.BOT_STATUS, bot);
            this.logger.log('Success: bot status updated');
        }
    }
}
