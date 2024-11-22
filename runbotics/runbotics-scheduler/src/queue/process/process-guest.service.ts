import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IAuthority, Role } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { GuestService } from '#/scheduler-database/guest/guest.service';
import { User } from '#/scheduler-database/user/user.entity';

const GUEST_EXECUTION_LIMIT = 10;

@Injectable()
export class ProcessGuestService {
    private readonly logger = new Logger(ProcessGuestService.name);

    constructor(
        private readonly guestService: GuestService,
    ) {
    }

    getIsGuest(userAuthorities: IAuthority[]): boolean {
        return userAuthorities
            .some(authority => authority.name === Role.ROLE_GUEST);
    }

    getExecutionsCount(userId: number): Promise<number> {
        return this.guestService
            .findByUserId(userId)
            .then(guest => guest.executionsCount)
            .catch(() => {
                this.logger.error(`Failed to get executions-count for user (${userId})`);

                throw new HttpException({
                    message: 'Could not get executions count for guest',
                    statusCode: HttpStatus.NOT_FOUND,
                }, HttpStatus.NOT_FOUND);
            });
    }

    async checkCanStartProcess(reqUser: User) {
        if(!this.getIsGuest(reqUser.authorities)) return;

        const guest = await this.guestService.findByUserId(reqUser.id);
        if(guest.executionsCount < GUEST_EXECUTION_LIMIT) return;

        this.logger.error(`Guest ${reqUser.id} has exceeded the execution limit: ${GUEST_EXECUTION_LIMIT} runs`);
        throw new HttpException({
            message: 'Guest run limit exceeded',
            statusCode: HttpStatus.FORBIDDEN
        }, HttpStatus.FORBIDDEN);
    }
}
