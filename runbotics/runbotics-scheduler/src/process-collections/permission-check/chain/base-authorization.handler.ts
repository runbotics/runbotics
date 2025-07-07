import { AuthorizationHandler } from './authorization-handler.interface';
import { AuthRequest } from '#/types';

export abstract class BaseAuthorizationHandler implements AuthorizationHandler {
    private nextHandler: AuthorizationHandler;

    public setNext(handler: AuthorizationHandler): AuthorizationHandler {
        this.nextHandler = handler;
        return handler;
    }

    public async handle(request: AuthRequest, collectionId?: string): Promise<boolean> {
        if (this.nextHandler) {
            return this.nextHandler.handle(request, collectionId);
        }

        return false;
    }
}
