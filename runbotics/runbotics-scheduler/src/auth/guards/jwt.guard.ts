import {
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    @Inject() readonly reflector: Reflector;

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        if (this.isPublic(context)) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException(info.message);
        }
        return user;
    }

    isPublic(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) || this.isPrometheusMetricsEndpoint(context.getArgs()[0]?.url, context.getArgs()[0]?.method);
    }

    isPrometheusMetricsEndpoint(url: string, methodType: string): boolean {
        return 'GET' === methodType && '/metrics' === url;
    }
}
