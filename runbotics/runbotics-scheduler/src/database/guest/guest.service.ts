import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { GuestEntity } from './guest.entity';
import { Guest } from 'runbotics-common';

@Injectable()
export class GuestService {
    constructor(
        @InjectRepository(GuestEntity)
        private guestRepository: Repository<GuestEntity>,
    ) { }

    async findById(userId: number): Promise<Guest> {
        return this.guestRepository.findOne({ where: { userId }});
    }

    async update(newGuest: Guest): Promise<UpdateResult> {
        return this.guestRepository.update(newGuest.ip, newGuest);
    }

    async setExecutionsCount(userId: number, newCount: number): Promise<UpdateResult> {
        return this.guestRepository.update({ userId }, { executionCount: newCount });
    }

    async incrementExecutionsCount(userId: number): Promise<UpdateResult> {
        return this.guestRepository.increment({ userId }, 'executionCount', 1);
    }
}
