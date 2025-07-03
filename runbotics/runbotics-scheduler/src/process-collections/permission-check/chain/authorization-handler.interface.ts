import { AuthRequest } from '#/types';

export interface AuthorizationHandler {
    setNext(handler: AuthorizationHandler): AuthorizationHandler;
    handle(request: AuthRequest, collectionId?: number): Promise<boolean>;
}
