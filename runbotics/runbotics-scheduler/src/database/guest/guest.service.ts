import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { GuestEntity } from './guest.entity';
import { Guest } from 'runbotics-common';

const relations = ['user'];

@Injectable()
export class GuestService {
    constructor(
        @InjectRepository(GuestEntity)
        private guestRepository: Repository<GuestEntity>,
    ) { }

    async findByUserId(userId: number) {
        return this.guestRepository.findOne({ where: { user: { id: userId } }, relations });
    }

    async update(newGuest: Guest): Promise<UpdateResult> {
        return this.guestRepository.update(newGuest.ipHash, newGuest);
    }

    async setExecutionsCount(userId: number, newCount: number): Promise<UpdateResult> {
        return this.guestRepository.update({ user: { id: userId } }, { executionsCount: newCount });
    }

    async incrementExecutionsCount(userId: number): Promise<UpdateResult> {
        return this.guestRepository.increment({ user: { id: userId } }, 'executionsCount', 1);
    }

    async decrementExecutionsCount(userId: number): Promise<UpdateResult> {
        return this.guestRepository.decrement({ user: { id: userId } }, 'executionsCount', 1);
    }
}
