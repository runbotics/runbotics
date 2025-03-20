import { ServerConfigService } from '#/config/server-config';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SsoMicrosoftInterceptor implements NestInterceptor {
    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {}

    intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
        if (this.serverConfigService.microsoftAuth.isSsoEnabled !== 'true') {
            throw new NotFoundException();
        }

        return next.handle();
    }
}
