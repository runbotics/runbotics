import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollectionService } from './process-collection.service';
import { CreateProcessCollectionDto, createProcessCollectionSchema, CreateProcessCollectionSwaggerDto } from './dto/create-process-collection.dto';
import { UpdateProcessCollectionDto, updateProcessCollectionSchema, UpdateProcessCollectionSwaggerDto } from './dto/update-process-collection.dto';
import { UUID } from 'crypto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { ProcessCollection } from './process-collection.entity';
import { ApiDefaultAuthResponses } from '#/utils/decorators/swagger/ApiDefaultAuthResponses.decorator';
import { SwaggerTags } from '#/utils/swaggerTags';

@ApiTags(SwaggerTags.PROCESS_COLLECTION)
@ApiDefaultAuthResponses()
@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/process-collection')
export class ProcessCollectionController {
    constructor(
        private readonly processCollectionService: ProcessCollectionService,
    ) {}

    @ApiOperation({
        summary:'Checks if user has access to specific proccess collection'
    })
    @ApiQuery({
        name: 'parentId',
        required: true,
        type: 'string',
        description: 'UUID of the parent collection to check access for.',
        example: '9f1c40b2-8c7b-4a88-98b1-5b6e2a54e12e',
    })
    @ApiOkResponse({
        description: 'The user has access to the specified parent collection.',
    })
    @ApiBadRequestResponse({
        description: 'Missing parentId parameter or invalid UUID format.',
    })
    @ApiForbiddenResponse({
        description: 'The user does not have access to the specified collection.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get('/access')
    async checkAccessToParent(
        @UserDecorator() user: User,
        @Query('parentId', new ParseUUIDPipe()) parentId: UUID,
    ) {
        if (parentId) {
            await this.processCollectionService.checkCollectionAvailability(parentId, user);
        } else {
            throw new BadRequestException('ParentId is required');
        }
    }

    @ApiOperation({
        summary: 'Get all process collections accessible to the current user',
        description: 'Returns a list of all process collections that the authenticated user has access to.',
    })
    @ApiOkResponse({
        description: 'List of accessible process collections successfully retrieved.',
        type: [ProcessCollection],
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to read process collections.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get('/user-accessible')
    async getAllUserAccessibleHierarchy(
        @UserDecorator() user: User,
    ) {
        return this.processCollectionService.getUserAccessible(user);
    }

    @ApiOperation({
        summary: 'Get a process collection by its ID',
        description: 'Returns the details of a specific process collection if the user has access to it.',
    })
    @ApiParam({
        name: 'id',
        description: 'UUID of the process collection to retrieve',
        type: 'string',
        format: 'uuid',
        example: '8a45c2b7-e25b-4b2e-9e3a-b6b2892e741f',
    })
    @ApiOkResponse({
        description: 'Process collection successfully retrieved.',
        type: ProcessCollection,
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID format (not a valid UUID).',
    })
    @ApiForbiddenResponse({
        description: 'User does not have access to this process collection.',
    })
    @ApiNotFoundResponse({
        description: 'Process collection not found.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get('/:id')
    async getProcessCollectionById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @UserDecorator() user: User,
    ) {
        return this.processCollectionService.getProcessCollectionById(id, user);
    }


    @ApiOperation({
        summary: 'Get root or child process collections',
        description: `Returns child collections for a given parentId. 
    If no parentId is provided, returns root-level process collections.
    Also returns breadcrumbs (ancestral path) for the selected parent if provided.`,
    })
    @ApiQuery({
        name: 'parentId.equals',
        required: false,
        type: 'string',
        description: 'UUID of the parent collection. If omitted, root collections will be returned.',
        example: '9f1c40b2-8c7b-4a88-98b1-5b6e2a54e12e',
    })
    @ApiOkResponse({
        description: 'List of accessible child collections and breadcrumbs (if parentId provided).',
        schema: {
            type: 'object',
            properties: {
                breadcrumbs: {
                    type: 'array',
                    items: { $ref: getSchemaPath(ProcessCollection) },
                },
                childrenCollections: {
                    type: 'array',
                    items: { $ref: getSchemaPath(ProcessCollection) },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid UUID format or access error.',
    })
    @ApiForbiddenResponse({
        description: 'User does not have access to the requested collection.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get()
    async getAll(
        @UserDecorator() user: User,
        @Query('parentId.equals') parentId?: string,
    ) {
        if (parentId) {
            this.processCollectionService.checkCollectionAvailability(parentId, user);

            const breadcrumbs = await this.processCollectionService.getCollectionAllAncestors(parentId, user);
            const children = await this.processCollectionService.getChildrenCollectionsByParent(parentId, user);

            return { breadcrumbs, childrenCollections: children };
        }

        const children = await this.processCollectionService.getChildrenCollectionsByRoot(user);
        return { childrenCollections: children, breadcrumbs: [] };
    }

    @ApiOperation({
        summary: 'Create a new process collection',
        description: `Creates a new process collection within the user's tenant. 
    The user must have access to the specified parent collection (if provided). 
    Collection name must be unique within the parent scope for the same creator.`,
    })
    @ApiBody({
        type: CreateProcessCollectionSwaggerDto,
        description: 'Data for the new process collection, including name, visibility, and optional parent ID and assigned users.',
    })
    @ApiCreatedResponse({
        description: 'The process collection has been successfully created.',
        type: ProcessCollection,
    })
    @ApiBadRequestResponse({
        description: `Returned when:
    - The user has no access to the specified parent collection.
    - A collection with the same name already exists in this location for the creator.
    - The provided parentId does not point to an existing collection.`,
    })
    @ApiNotFoundResponse({
        description: 'Parent collection not found (if parentId is provided but does not exist).',
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to create a collection in the given context.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_ADD)
    @Post()
    async create(
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(createProcessCollectionSchema)) createDto: CreateProcessCollectionDto,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.create(user, createDto);
    }


    @ApiOperation({
    summary: 'Update a process collection',
    description: 'Updates an existing process collection by ID. User must have access.',
    })
    @ApiParam({
    name: 'id',
    description: 'UUID of the process collection to update',
    type: 'string',
    format: 'uuid',
    example: 'd1234567-89ab-4cde-1234-56789abcdef0',
    })
    @ApiBody({
    type: UpdateProcessCollectionSwaggerDto,
    description: 'Data for updating a process collection',
    })
    @ApiOkResponse({
    description: 'The process collection was successfully updated.',
    type: ProcessCollection,
    })
    @ApiBadRequestResponse({
    description: 'Validation failed or invalid UUID format.',
    })
    @ApiNotFoundResponse({
    description: 'No process collection found with the given ID.',
    })
    @ApiForbiddenResponse({
    description: 'User does not have permission to update this collection.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_EDIT)
    @Put('/:id')
    async update(
    @UserDecorator() user: User,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProcessCollectionSchema)) updateDto: UpdateProcessCollectionDto,
    ) {
    return this.processCollectionService.update(user, updateDto, id);
    }

    @ApiOperation({
        summary: 'Delete a process collection',
        description: 'Deletes a process collection by its ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'UUID of the process collection to delete',
        type: 'string',
        format: 'uuid',
        example: '4c41f885-1a4d-4f0f-8e1f-d0615c1e2f91',
    })
    @ApiNoContentResponse({
        description: 'Process collection successfully deleted. No content returned.',
    })
    @ApiNotFoundResponse({
        description: 'No process collection found with the provided ID.',
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to delete this process collection.',
    })
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async delete(
        @UserDecorator() user: User,
        @Param('id') id: string,
    ) {
        await this.processCollectionService.delete(id, user);
    }

}
