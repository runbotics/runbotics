import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    MessageBody,
    SubscribeMessage,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from 'src/utils/logger';
import { AuthService } from 'src/auth/auth.service';
import { BotLogService } from '../bot-log/bot-log.service';
import { BotProcessService } from '../process-launch/bot-process.service';
import { BotWsMessage, IProcessInstance, IProcessInstanceEvent, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { BotProcessEventService } from '../process-launch/bot-process-event.service';
import { BotAuthSocket } from 'src/types/auth-socket';
import { WsBotJwtGuard } from 'src/auth/guards';
import { UiGateway } from './ui.gateway';
import { BotService } from 'src/database/bot/bot.service';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { FileUploadService } from 'src/queue/upload/file-upload.service';
import { MicrosoftSessionService } from 'src/auth/microsoft.session';


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
        private readonly serverConfigSercvice: ServerConfigService,
        private readonly fileUploadService: FileUploadService,
        private readonly microsoftSessionService: MicrosoftSessionService,
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

        if (botExists) {
            const bot = await this.authService.unregisterBot(installationId as string);

            this.uiGateway.server.emit(WsMessage.BOT_STATUS, bot);

            this.logger.log(`Bot disconnected: ${installationId} | ${client.id}`);
        }
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE)
    async listenForProcess(
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstance: IProcessInstance,
    ) {
        const installationId = socket.bot.installationId;
        this.logger.log(`=> Updating process-instance (${processInstance.id}) by bot (${installationId}) | status: ${processInstance.status}`);
        await this.botProcessService.updateProcessInstance(installationId, processInstance);
        this.logger.log(`<= Success: process-instance (${processInstance.id}) updated by bot (${installationId}) | status: ${processInstance.status}`);
        if (processInstance.status === ProcessInstanceStatus.COMPLETED && this.serverConfigSercvice.sharepointPassword) {
            this.logger.log('Clearing sharepoint temporary files');
            const { token } = await this.microsoftSessionService.getToken();
            await this.fileUploadService.deleteTempFolder(token, processInstance.orchestratorProcessInstanceId)
                .catch(() => this.logger.log('Temp folder not found'));
        }
    }

    @UseGuards(WsBotJwtGuard)
    @SubscribeMessage(BotWsMessage.PROCESS_INSTANCE_EVENT)
    async listenForProcessInstanceEvent(
        @ConnectedSocket() socket: BotAuthSocket,
        @MessageBody() processInstanceEvent: IProcessInstanceEvent,
    ) {
        const installationId = socket.bot.installationId;
        this.logger.log(`=> Updating process-instance-event (${processInstanceEvent.executionId}) by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
        await this.botProcessEventService.updateProcessInstanceEvent(processInstanceEvent, socket.bot);
        this.logger.log(`<= Success: process-instance-event (${processInstanceEvent.executionId}) updated by bot (${installationId}) | step: ${processInstanceEvent.step}, status: ${processInstanceEvent.status}`);
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
}
