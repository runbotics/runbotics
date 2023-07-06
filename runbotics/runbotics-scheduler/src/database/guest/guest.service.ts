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

    async findByUserId(userId: number): Promise<Guest> {
        return this.guestRepository.findOne({ where: { userId } });
    }

    async update(newGuest: Guest): Promise<UpdateResult> {
        return this.guestRepository.update(newGuest.ip, newGuest);
    }

    async setExecutionsCount(userId: number, newCount: number): Promise<UpdateResult> {
        return this.guestRepository.update({ userId }, { executionsCount: newCount });
    }

    async incrementExecutionsCount(userId: number): Promise<UpdateResult> {
        return this.guestRepository.increment({ userId }, 'executionsCount', 1);
    }

    async decrementExecutionsCount(userId: number): Promise<UpdateResult> {
        return this.guestRepository.decrement({ userId }, 'executionsCount', 1);
    }
}
