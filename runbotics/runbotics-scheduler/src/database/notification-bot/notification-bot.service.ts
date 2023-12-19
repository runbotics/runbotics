import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationBotEntity } from './notification-bot.entity';
import { Repository } from 'typeorm';

const relations = ['bot', 'user'];

@Injectable()
export class NotificationBotService {
    constructor(
        @InjectRepository(NotificationBotEntity)
        private readonly notificationBotRepository: Repository<NotificationBotEntity>,
    ) {}

    findAllByBotId(id: number) {
        return this.notificationBotRepository.find({ where: { bot: { id } }, relations });
    }

    delete(id: number) {
        return this.notificationBotRepository.delete(id);
    }
}
