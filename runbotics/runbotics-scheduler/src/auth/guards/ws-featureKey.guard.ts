import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { FeatureKey } from 'runbotics-common';
import { FEATURE_KEY } from '../featureKey.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class WsFeatureKeyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient<Socket>();

        const user = await this.authService.validateWebsocketConnection(client);

        const requiredKeys = this.reflector.getAllAndOverride<FeatureKey[] | undefined>(FEATURE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];

        const featureKeys = [...new Set([...requiredKeys])];

        const userKeys = user.authorities.flatMap((auth) => auth.featureKeys).map((featureKey) => featureKey.name);

        return featureKeys.every((key) => userKeys.includes(key));
    }
}