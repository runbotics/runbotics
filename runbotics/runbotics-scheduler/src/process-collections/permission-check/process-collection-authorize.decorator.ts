import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
    ProcessCollectionAuthorizationGuard,
} from '#/process-collections/permission-check/process-collection-authorization.guard';

export const CollectionAuthorize = (paramKey: string = 'id'): MethodDecorator & ClassDecorator =>
    applyDecorators(
        SetMetadata('COLLECTION_ID', paramKey),
        UseGuards(ProcessCollectionAuthorizationGuard),
    );
