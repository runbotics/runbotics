import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#/scheduler-database/user/user.entity';
import { NotificationProcess } from './notification-process.entity';
import { CreateNotificationProcessDto } from './dto/create-notification-process.dto';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { isTenantAdmin } from '#/utils/authority.utils';


@Injectable()
export class NotificationProcessService {
    private readonly logger = new Logger(NotificationProcessService.name);

    constructor(
        @InjectRepository(NotificationProcess)
        private readonly notificationProcessRepository: Repository<NotificationProcess>,
        private readonly processService: ProcessService,
    ) { }

    async getAllByProcessId(processId: number) {
        return this.notificationProcessRepository.find({ where: { process: { id: processId } }, relations: ['user'] });
    }

    async getAllByProcessIdAndUser(processId: number, user: User) {
        const process = await this.processService.checkAccessAndGetById(
            processId, user
        );

        return this.notificationProcessRepository
            .find({ where: { process: { id: process.id } }, relations: ['user'] })
            .then(processes => processes.map(this.formatToDTO));
    }

    async create(
        createNotificationProcessDto: CreateNotificationProcessDto,
        user: User
    ) {
        const process = await this.processService.checkAccessAndGetById(
            createNotificationProcessDto.processId, user
        );

        if (createNotificationProcessDto.email && !isTenantAdmin(user)) {
            throw new ForbiddenException();
        }

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
        const findOptions =  {
            id: notificationProcessId
        };
        
        const notification = await this.notificationProcessRepository
            .findOneOrFail({
                where: findOptions, 
                relations: ['process']
            }).catch(() => {
                throw new BadRequestException('Cannot delete process notification');
            });

        await this.processService.checkAccessAndGetById(
            notification.process.id,
            user,
        );

        if (notification.email && !isTenantAdmin(user)) {
            throw new ForbiddenException();
        }

        await this.notificationProcessRepository
            .delete(findOptions);
    }

    private formatToDTO(notificationProcess: NotificationProcess) {
        return {
            type: notificationProcess.type,
            id: notificationProcess.id,
            user: {
                id: notificationProcess.user.id,
                email: notificationProcess.user.email
            },
            email: notificationProcess.email ?? '',
            createdAt: notificationProcess.createdAt
        };
    }
}
