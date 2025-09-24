import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Guest } from '#/scheduler-database/guest/guest.entity';
import bcrypt from 'bcryptjs';
import { Role } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import { Authority } from '#/scheduler-database/authority/authority.entity';
import { randomUUID } from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '#/utils/logger';

@Injectable()
export class AuthGuestService {
    private readonly logger = new Logger(AuthGuestService.name);
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
    }

    async verifyGuestLimit(ip: string) {
        const quests = (await this.dataSource.manager.find(Guest))
            .filter(guest => bcrypt.compareSync(ip, guest.ipHash));
        return quests.length === 0;

    }

    async createGuestUser(ip: string, langKey: string) {
        const newGuest = await this.dataSource.manager.transaction(async transactionalEntityManager => {
            const newGuestUser = new User();
            newGuestUser.langKey = langKey;
            newGuestUser.activated = true;
            newGuestUser.authorities = [await transactionalEntityManager.findOne(Authority, {
                where: {
                    name: Role.ROLE_GUEST,
                },
            })];
            newGuestUser.createdBy = 'system';
            newGuestUser.activationKey = randomUUID().slice(0, 19);
            newGuestUser.passwordHash = await bcrypt.hash(randomUUID(), 10);
            newGuestUser.tenantId = 'b7f9092f-5973-c781-08db-4d6e48f78e98';
            newGuestUser.email = `guest-${randomUUID()}@runbotics.com`;
            newGuestUser.firstName = 'Guest';
            newGuestUser.lastName = 'User';
            newGuestUser.lastModifiedBy = 'system';
            const newGeneratedGuestUser = await transactionalEntityManager.save(User, newGuestUser);

            const ipHash = await bcrypt.hash(ip, 10);
            const newGuest = new Guest();
            newGuest.ipHash = ipHash;
            newGuest.user = newGeneratedGuestUser;
            newGuest.executionsCount = 0;
            await transactionalEntityManager.save(Guest, newGuest);
            return newGuest;
        });
        return newGuest;
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteOldGuests() {
        this.logger.log('Deleting old guests');
        const guests = await this.dataSource.manager.find(Guest, { relations: { user: true } });
        await this.dataSource.manager.delete(User, { id: In(guests.map(guest => guest.user.id)) });
    }

}
