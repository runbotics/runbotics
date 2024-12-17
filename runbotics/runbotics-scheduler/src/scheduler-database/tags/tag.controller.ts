import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, UseInterceptors } from '@nestjs/common';

import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';

import { TagService } from './tag.service';
import { Tenant } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { CreateTagDto, createTagSchema } from './dto/create-tag.dto';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/tags')
export class TagController {
    private readonly logger = new Logger(TagController.name);

    constructor(private readonly tagService: TagService) {}

    @Get()
    getAllTags(
        @Param('tenantId', ParseUUIDPipe) tenantId: Tenant['id'],
        @Query('name.contains') searchPhrase: string | undefined,
    ) {
        this.logger.log(`REST request to get all tags for the tenant: ${tenantId}`);
        return this.tagService.getAll(tenantId, searchPhrase);
    }

    @Get(':id')
    async getTag(
        @Param('id', ParseIntPipe) id: number,
        @UserDecorator() user: User,
    ) {
        this.logger.log(`REST request to get one tag by id: ${id}`);

        const foundTag = await this.tagService.getById(id, user);

        if (!foundTag) throw new BadRequestException(`Tag with id ${id} not found`);

        return this.tagService.getById(id, user);
    }

    @Post()
    createTag(
        @Body(new ZodValidationPipe(createTagSchema)) tagDto: CreateTagDto,
        @UserDecorator() user: User,
    ) {
        this.logger.log(`REST request to create a tag by user with id, ${user.id} under tenant ${user.tenantId}`);
        return this.tagService.create(user, tagDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTagById(
        @Param('id', ParseIntPipe) id: number,
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log(`REST request to delete a tag by id: ${id}`);
        await this.tagService.delete(id, tenantId);
    }
}