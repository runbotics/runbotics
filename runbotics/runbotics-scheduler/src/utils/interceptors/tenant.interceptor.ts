import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common' ;
import { Observable } from 'rxjs' ;

import { AuthRequest } from '#/types';

const API_URL_UUID_REGEX = /^\/api\/scheduler\/tenants\/([[0-9a-z-]+).*/;

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const regexUUIDmatch = request.url.match(API_URL_UUID_REGEX);

        if (!regexUUIDmatch || request.user.tenantId !== regexUUIDmatch[1]) {
            throw new NotFoundException('Destination resource not found');
        }

        return next.handle();
    }
}
