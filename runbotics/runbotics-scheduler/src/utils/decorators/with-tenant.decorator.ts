import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { applyDecorators, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common';

export const GetWithTenant = (path: string) => applyDecorators(
    Get(`/tenants/:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);

export const PostWithTenant = (path: string) => applyDecorators(
    Post(`/tenants/:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);

export const PatchWithTenant = (path: string) => applyDecorators(
    Patch(`/tenants/:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);

export const DeleteWithTenant = (path: string) => applyDecorators(
    Delete(`/tenants/:tenantId/${path}`),
    UseInterceptors(TenantInterceptor)
);
