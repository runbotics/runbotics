import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IAuthority, IUser, Role } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { GuestService } from '#/database/guest/guest.service';

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
            .findById(userId)
            .then(guest => guest.executionCount);
    }

    async checkCanStartProcess(reqUser: IUser): Promise<void> {
        if(!this.getIsGuest(reqUser.authorities)) return;

        const guest = await this.guestService.findById(reqUser.id);
        if(guest.executionCount < GUEST_EXECUTION_LIMIT) return;
        
        this.logger.error(`Guest ${reqUser.id} has exceeded the execution limit: ${GUEST_EXECUTION_LIMIT} runs`);
        throw new HttpException({
            message: 'Guest run limit exceeded',
            statusCode: HttpStatus.FORBIDDEN
        }, HttpStatus.FORBIDDEN);
    }
}
