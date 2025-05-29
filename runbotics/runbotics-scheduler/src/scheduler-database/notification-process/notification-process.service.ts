import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#/scheduler-database/user/user.entity';
import { NotificationProcess } from './notification-process.entity';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { hasRole, isTenantAdmin } from '#/utils/authority.utils';
import { CreateNotificationProcessDto, Role } from 'runbotics-common';

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

        if (hasRole(user, Role.ROLE_TENANT_ADMIN)) {
            return this.notificationProcessRepository
                .find({ where: { process: { id: process.id } }, relations: ['user'] })
                .then(processes => processes.map(this.formatToDTO));
        } else {
            return this.notificationProcessRepository
                .find({ where: { process: { id: process.id }, customEmail: '' }, relations: ['user'] })
                .then(processes => processes.map(this.formatToDTO));
        }
    }

    async create(
        createNotificationProcessDto: CreateNotificationProcessDto,
        user: User
    ) {
        const process = await this.processService.checkAccessAndGetById(
            createNotificationProcessDto.processId, user
        );

        if (createNotificationProcessDto.customEmail && !isTenantAdmin(user)) {
            throw new ForbiddenException();
        }

        const newNotification = new NotificationProcess();
        newNotification.process = process;
        newNotification.user = user;
        newNotification.customEmail = createNotificationProcessDto.customEmail ?? '';
        newNotification.type = createNotificationProcessDto.type;

        return this.notificationProcessRepository
            .save(newNotification)
            .then(this.formatToDTO);
    }

    async delete(notificationProcessId: string, user: User) {
        const findOptions = {
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

        if (notification.customEmail && !isTenantAdmin(user)) {
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
                email: notificationProcess.user.email,
            },
            customEmail: notificationProcess.customEmail ?? '',
            createdAt: notificationProcess.createdAt
        };
    }
}
