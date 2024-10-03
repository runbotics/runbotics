import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { applyDecorators, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common';

export const GetWithTenant = (path: string) => applyDecorators(
    Get(`:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);

export const PostWithTenant = (path: string) => applyDecorators(
    Post(`:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);

export const PatchWithTenant = (path: string) => applyDecorators(
    Patch(`:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);

export const DeleteWithTenant = (path: string) => applyDecorators(
    Delete(`:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);
