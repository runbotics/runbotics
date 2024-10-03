import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';
import { NotificationProcess } from './notification-process.entity';
import { CreateNotificationProcessDto } from './dto/create-notification-process.dto';
import { ProcessService } from '#/database/process/process.service';


@Injectable()
export class NotificationProcessService {
    private readonly logger = new Logger(NotificationProcessService.name);

    constructor(
        @InjectRepository(NotificationProcess)
        private readonly notificationProcessRepository: Repository<NotificationProcess>,
        private readonly processService: ProcessService,
    ) {}

    async getAllByProcessId(processId: number, user: UserEntity) {
        const process = await this.processService.checkAccessAndGetById(
            processId, user
        );

        return this.notificationProcessRepository
            .find({ where: { process: { id: process.id } }, relations: ['user']})
            .then(processes => processes.map(this.formatToDTO));
    }

    async create(
        createNotificationProcessDto: CreateNotificationProcessDto,
        user: UserEntity
    ) {
        const process = await this.processService.checkAccessAndGetById(
            createNotificationProcessDto.processId, user
        );

        const newNotification = new NotificationProcess();
        newNotification.process = process;
        newNotification.user = user;
        newNotification.type = createNotificationProcessDto.type;

        return this.notificationProcessRepository
            .save(newNotification)
            .then(this.formatToDTO);
    }

    async delete(notificationProcessId: string, userId: number) {
        const findOptions = { id: notificationProcessId, user: { id: userId } };

        await this.notificationProcessRepository
            .findOneByOrFail(findOptions).catch(() => {
                throw new BadRequestException('Cannot delete process notification');
            });

        await this.notificationProcessRepository
            .delete(findOptions);
    }

    private formatToDTO(notificationProcess: NotificationProcess) {
        return {
            type: notificationProcess.type,
            id: notificationProcess.id,
            user: {
                id: notificationProcess.user.id,
                login: notificationProcess.user.login
            },
            createdAt: notificationProcess.createdAt
        };
    }
}
