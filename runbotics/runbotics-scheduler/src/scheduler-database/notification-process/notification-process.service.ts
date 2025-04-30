import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#/scheduler-database/user/user.entity';
import { NotificationProcess } from './notification-process.entity';
import { CreateNotificationProcessDto } from './dto/create-notification-process.dto';
import { ProcessService } from '#/scheduler-database/process/process.service';


@Injectable()
export class NotificationProcessService {
    private readonly logger = new Logger(NotificationProcessService.name);

    constructor(
        @InjectRepository(NotificationProcess)
        private readonly notificationProcessRepository: Repository<NotificationProcess>,
        private readonly processService: ProcessService,
    ) {}

    async getAllByProcessId(processId: number) {
        return this.notificationProcessRepository.find({ where: { process: { id: processId } }, relations: ['user'] });
    }

    async getAllByProcessIdAndUser(processId: number, user: User) {
        const process = await this.processService.checkAccessAndGetById(
            processId, user
        );

        return this.notificationProcessRepository
            .find({ where: { process: { id: process.id } }, relations: ['user']})
            .then(processes => processes.map(this.formatToDTO));
    }

    async create(
        createNotificationProcessDto: CreateNotificationProcessDto,
        user: User
    ) {
        this.logger.log('CREATE BEGIN');
        const process = await this.processService.checkAccessAndGetById(
            createNotificationProcessDto.processId, user
        );

        const newNotification = new NotificationProcess();
        newNotification.process = process;
        newNotification.user = user;
        newNotification.email = createNotificationProcessDto.email ?? '';
        newNotification.type = createNotificationProcessDto.type;

        return this.notificationProcessRepository
            .save(newNotification)
            .then(this.formatToDTO);
    }

    async delete(notificationProcessId: string, user: User) {
        const findOptions = { id: notificationProcessId };

        // TODO(teawithsand): ~here check user permissions to process

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
            user: notificationProcess.user ? {
                id: notificationProcess.user.id,
                email: notificationProcess.user.email
            } : null,
            email: notificationProcess.email ?? '',
            createdAt: notificationProcess.createdAt
        };
    }
}
