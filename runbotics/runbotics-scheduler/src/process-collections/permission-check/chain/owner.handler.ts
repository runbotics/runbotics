import { Injectable } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { AuthRequest } from '#/types';

@Injectable()
export class OwnerHandler extends BaseAuthorizationHandler {
    //TODO implement handler
    async handle(request: AuthRequest, collectionId: number): Promise<boolean> {
        return true;

        return super.handle(request);
    }
}
