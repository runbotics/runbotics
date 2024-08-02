import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'runbotics-common';

import { UserEntity } from '#/database/user/user.entity';
import { NotificationProcess } from './notification-process.entity';
import { ProcessEntity } from '#/database/process/process.entity';
import { CreateNotificationProcessDto } from './dto/create-notification-process.dto';


@Injectable()
export class NotificationProcessService {
    private readonly logger = new Logger(NotificationProcessService.name);

    constructor(
        @InjectRepository(NotificationProcess)
        private readonly notificationProcessRepository: Repository<NotificationProcess>,
        @InjectRepository(ProcessEntity)
        private readonly processRepository: Repository<ProcessEntity>,
    ) {}

    async getAllByProcessId(processId: number, user: UserEntity) {
        const process = await this.checkProcessAccessAndGetById(
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
        const process = await this.checkProcessAccessAndGetById(
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

    private async checkProcessAccessAndGetById(processId: number, user: UserEntity) {
        // TODO: to be updated after process migration to scheduler
        return user.authorities.find(authority => authority.name === Role.ROLE_TENANT_ADMIN)
            ? this.processRepository.findOneByOrFail({ id: processId, tenantId: user.tenantId })
                .catch(() => {
                    throw new NotFoundException();
                })
            : this.processRepository.findOneByOrFail([
                {
                    id: processId,
                    tenantId: user.tenantId,
                    isPublic: true
                },
                {
                    id: processId,
                    tenantId: user.tenantId,
                    createdBy: { id: user.id }
                }
            ]).catch(() => {
                throw new NotFoundException();
            });
    }
}
