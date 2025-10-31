import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    Body,
    Controller, Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { CreateProcessDto, createProcessSchema, CreateProcessSwaggerDto } from '#/scheduler-database/process/dto/create-process.dto';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { UpdateProcessDto, updateProcessSchema, UpdateProcessSwaggerDto } from '#/scheduler-database/process/dto/update-process.dto';
import { ProcessCrudService } from '#/scheduler-database/process/process-crud.service';
import { UpdateDiagramDto, updateDiagramSchema, UpdateDiagramSwaggerDto } from '#/scheduler-database/process/dto/update-diagram.dto';
import { UpdateAttendedDto, updateAttendedSchema, UpdateAttendedSwaggerDto } from '#/scheduler-database/process/dto/update-attended.dto';
import { UpdateTriggerableDto, updateTriggerableSchema, UpdateTriggerableSwaggerDto } from '#/scheduler-database/process/dto/update-triggerable.dto';
import {
    UpdateProcessBotCollectionDto,
    updateProcessBotCollectionSchema,
    UpdateProcessBotCollectionSwaggerDto,
} from '#/scheduler-database/process/dto/update-process-bot-collection.dto';
import {
    UpdateProcessOutputTypeDto,
    updateProcessOutputTypeSchema,
    UpdateProcessOutputTypeSwaggerDto,
} from '#/scheduler-database/process/dto/update-process-output-type.dto';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { ProcessCriteria } from '#/scheduler-database/process/criteria/process.criteria';
import {
    updateProcessBotSystemSchema,
    UpdateProcessBotSystemDto,
    UpdateProcessBotSystemSwaggerDto,
} from '#/scheduler-database/process/dto/update-process-bot-system.dto';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { UpdateExecutionInfoDto, updateExecutionInfoSchema, UpdateExecutionInfoSwaggerDto } from './dto/update-execution-info.dto';
import { isTenantAdmin } from '#/utils/authority.utils';
import { BlacklistGuard } from '#/blacklist-actions-auth/blacklist.guard';

import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { processIdSwaggerObjectDescription, SwaggerTags } from '#/utils/swagger.utils';
import { ApiDefaultAuthResponses } from '#/utils/decorators/swagger/ApiDefaultAuthResponses.decorator';
import { ApiProcessPageFilters } from '#/utils/decorators/swagger/ApiProcessPageFilters.decorator';
import { UpdateProcessWebhookDto, updateProcessWebhookSchema, UpdateProcessWebhookSwaggerDto } from './dto/update-webhooks.dto';
@ApiTags(SwaggerTags.PROCESS)
@ApiDefaultAuthResponses()
@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/processes')
export class ProcessController {
    private readonly logger = new Logger(ProcessController.name);

    constructor(
        private readonly processService: ProcessService,
        private readonly processCrudService: ProcessCrudService
    ) {}

    @ApiOperation({
        summary: 'Create a new process',
        description: `Creates a new process in the system for the current tenant.
            The user must have permission to add processes.
            Tag list cannot exceed 15 items. The process is validated against the blacklist of actions.`,
    })
    @ApiBody({
        type: CreateProcessSwaggerDto,
    })
    @ApiCreatedResponse({
        description: 'The process has been successfully created.',
        type: ProcessEntity,
    })
    @ApiBadRequestResponse({
        description: 'Returned when the tag limit (15) is exceeded.',
    })
    @Post()
    @FeatureKeys(FeatureKey.PROCESS_ADD)
    @UseGuards(BlacklistGuard)
    createProcess(
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(createProcessSchema))
        processDto: CreateProcessDto
    ) {
        return this.processCrudService.create(user, processDto);
    }

    @ApiOperation({
        summary: 'Create a demo process for a guest user',
    })
    @ApiCreatedResponse({
        description: 'The guest demo process has been successfully created.',
        type: ProcessEntity,
    })
    @ApiForbiddenResponse({
        description:
            'Guest user has already created a demo process and cannot create another.',
    })
    @Post('guest')
    @FeatureKeys(FeatureKey.PROCESS_ADD_GUEST)
    async createGuestProcess(@UserDecorator() user: User) {
        const canCreate =
            await this.processCrudService.checkCreateProcessViability(user);

        if (!canCreate) {
            throw new ForbiddenException('Guest can create only one process');
        }

        return this.processCrudService.createGuestProcess(user);
    }

    @ApiOperation({ summary: 'Updates the information of a process',
    description: 'The updated process is validated against the blacklist of actions.'})
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        type: UpdateProcessSwaggerDto,
        description: 'Data for updating the process.',
    })
    @ApiOkResponse({
        description: 'The process was successfully updated',
        type: ProcessEntity,
    })
    @ApiBadRequestResponse({
        description: 'Returned when the tag limit (15) is exceeded.',
    })
    @ApiNotFoundResponse({
        description: 'Process with the specified ID was not found.',
    })
    @Patch(':id')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_INFO)
    @UseGuards(BlacklistGuard)
    async update(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessSchema))
        processDto: UpdateProcessDto
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.update(user, id, processDto);
    }

    @ApiOperation({
        summary: 'Update a process diagram',
        description:
            'Updates the diagram definition, execution info, and global variables of a specific process by its ID. ' +
            'The updated process is validated against the blacklist of actions',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description:
            'New diagram data including definition, execution info, and global variable IDs',
        type: UpdateDiagramSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'Process diagram successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @ApiBadRequestResponse({
        description:
            'Invalid request body or failed update due to business logic error.',
    })
    @Patch(':id/diagram')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_STRUCTURE)
    @UseGuards(BlacklistGuard)
    async setDiagram(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateDiagramSchema))
        updateDiagramDto: UpdateDiagramDto
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.updateDiagram(
            user,
            id,
            updateDiagramDto
        );
    }

    @ApiOperation({
        summary: 'Update execution info of a process',
        description:
            'Updates only the `executionInfo` field of a specific process identified by its numeric ID.' +
            'The updated process is validated against the blacklist of actions',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description: 'Object containing the updated executionInfo field',
        type: UpdateExecutionInfoSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'Execution info successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @Patch(':id/execution-info')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_INFO)
    @UseGuards(BlacklistGuard)
    async setExecutionInfo(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateExecutionInfoSchema))
        updateExecutionInfoDto: UpdateExecutionInfoDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, {
            executionInfo: updateExecutionInfoDto.executionInfo,
        });
    }

    @ApiOperation({
        summary: 'Update attended flag of a process',
        description:
            'Updates the `isAttended` flag of a specific process, which determines whether the process requires human attendance.',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description: 'Object containing the new value of the `isAttended` flag',
        type: UpdateAttendedSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'Attended flag successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @ApiBadRequestResponse({
        description:
            'Invalid request body or unsupported field for partial update.',
    })
    @Patch(':id/is-attended')
    @FeatureKeys(FeatureKey.PROCESS_IS_ATTENDED_EDIT)
    async setIsAttended(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateAttendedSchema))
        attendedDto: UpdateAttendedDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, {
            isAttended: attendedDto.isAttended,
        });
    }

    @ApiOperation({
        summary: 'Update triggerable flag of a process',
        description:
            'Updates the `isTriggerable` flag of a specific process. This flag controls whether the process can be triggered automatically. Only tenant admins are allowed to perform this action.',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description:
            'Object containing the new value of the `isTriggerable` flag',
        type: UpdateTriggerableSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'Triggerable flag successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @Patch(':id/is-triggerable')
    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EDIT)
    async setIsTriggerable(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateTriggerableSchema))
        triggerableDto: UpdateTriggerableDto
    ) {
        await this.hasTenantAdminAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, {
            isTriggerable: triggerableDto.isTriggerable,
        });
    }

    @ApiOperation({
        summary: 'Update bot collection of a process',
        description:
            'Assigns or changes the bot collection associated with a specific process. The bot collection determines which bots can execute this process.',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description: 'Object containing the bot collection reference to assign',
        type: UpdateProcessBotCollectionSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'Bot collection successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @Patch(':id/bot-collection')
    @FeatureKeys(FeatureKey.PROCESS_BOT_COLLECTION_EDIT)
    async setBotCollection(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessBotCollectionSchema))
        updateBotCollectionDto: UpdateProcessBotCollectionDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, {
            botCollection: updateBotCollectionDto.botCollection,
        });
    }

    @ApiOperation({
        summary: 'Update system name of a process',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description:
            'Object containing the new system name or null to remove it',
        type: UpdateProcessBotSystemSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'System name successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @Patch(':id/bot-system')
    @FeatureKeys(FeatureKey.PROCESS_BOT_SYSTEM_EDIT)
    async setBotSystem(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessBotSystemSchema))
        updateProcessBotSystemDto: UpdateProcessBotSystemDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.partialUpdate(
            user,
            id,
            updateProcessBotSystemDto
        );
    }

    @ApiOperation({
        summary: 'Update output type of a process',
        description:
            'Sets or changes the output type of a specific process. The output type defines how and in what format the process should return its results.',
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiBody({
        description: 'Object containing the new output type',
        type: UpdateProcessOutputTypeSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'Output type successfully updated. Returns the updated process entity.',
    })
    @ApiNotFoundResponse({
        description:
            'No process found with the provided ID for the current tenant.',
    })
    @Patch(':id/output-type')
    @FeatureKeys(FeatureKey.PROCESS_BOT_COLLECTION_EDIT)
    async setOutputType(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessOutputTypeSchema))
        updateOutputTypeDto: UpdateProcessOutputTypeDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, {
            output: updateOutputTypeDto.output,
        });
    }

    @ApiOperation({
        summary: 'Adds webhook process trigger',
    })
    @ApiBody({
        description:
            'Object containing the webhook id to assign',
        type: UpdateProcessWebhookSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'System name successfully updated. Returns added process webhook trigger details',
    })
    @ApiNotFoundResponse({
        description: 'Process not found or webhook not registered in the tenant',
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to add webhook to this process',
    })
    @Post(':id/webhooks')
    @FeatureKeys(FeatureKey.PROCESS_WEBHOOKS_EDIT)
    async addWebhook(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessWebhookSchema))
        updateProcessWebhookDto: UpdateProcessWebhookDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.addWebhook(
            user,
            id,
            updateProcessWebhookDto
        );
    }

    @ApiOperation({
        summary: 'Removes webhook process trigger',
    })
    @ApiBody({
        description:
            'Object containing the webhook id to assign',
        type: UpdateProcessWebhookSwaggerDto,
    })
    @ApiOkResponse({
        description:
            'System name successfully updated. Returns added process webhook trigger details.',
    })
    @ApiNotFoundResponse({
        description: 'Process not found or webhook not registered in the tenant',
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to delete webhook',
    })
    @Delete(':id/webhooks')
    @FeatureKeys(FeatureKey.PROCESS_WEBHOOKS_EDIT)
    async deleteWebhook(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessWebhookSchema))
        updateProcessWebhookDto: UpdateProcessWebhookDto
    ) {
        await this.hasConfigureAccess(user, id);

        return this.processCrudService.deleteWebhook(
            user,
            id,
            updateProcessWebhookDto
        );
    }

    @ApiOperation({
        summary: 'Get guest demo process',
        description:
            'Retrieves the demo process created by the current authenticated user (guest).',
    })
    @ApiOkResponse({
        description: 'Returns the guest demo process entity.',
        type: ProcessEntity,
    })
    @Get('guest')
    getGuestProcess(@UserDecorator() user: User) {
        return this.processService.findGuestDemoProcess(user);
    }

    @ApiOperation({
        summary: 'Get list of processes',
        description:
            'Retrieves a list of processes filtered by given criteria and user access rights.',
    })
    @ApiOkResponse({
        description:
            'Returns an array of processes matching the criteria and access permissions.',
        type: ProcessEntity,
        isArray: true,
    })
    @Get()
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    async getAll(
        @Specifiable(ProcessCriteria) specs: Specs<ProcessEntity>,
        @UserDecorator() user: User
    ) {
        return await this.processCrudService.getAll(user, specs);
    }

    @ApiOperation({
        summary: 'Get simplified list of processes',
        description:
            'Retrieves a simplified list of processes filtered by criteria and user access rights.',
    })
    @ApiOkResponse({
        description:
            'Returns an array of simplified process objects matching the criteria and permissions.',
        isArray: true,
    })
    @Get('simplified')
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    async getAllSimplified(
        @Specifiable(ProcessCriteria) specs: Specs<ProcessEntity>,
        @UserDecorator() user: User
    ) {
        return await this.processCrudService.getAllSimplified(user, specs);
    }

    @ApiOperation({
        summary:
            'Get paginated list of processes for a specific collection or without a collection',
    })
    @ApiProcessPageFilters()
    @ApiOkResponse({
        description: 'Returns a paginated list of processes.',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(ProcessEntity) },
                },
                total: {
                    type: 'integer',
                    example: 42,
                    description:
                        'Total number of processes matching the filters',
                },
                page: {
                    type: 'integer',
                    example: 0,
                    description: 'Current page index',
                },
                size: {
                    type: 'integer',
                    example: 20,
                    description: 'Number of items per page',
                },
            },
        },
    })
    @Get('GetPage')
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    getPage(
        @Specifiable(ProcessCriteria) specs: Specs<ProcessEntity>,
        @Pageable() paging: Paging,
        @UserDecorator() user: User
    ) {
        // @todo after process collection migration probably split these two endpoints into two separate (collection/all processes view (collection/all processes view)
        // @ts-expect-error property not in built-in type
        const { _type = 'isNull', _value } = specs.where.processCollectionId?.valueOf()?.value.at(0) ?? {};

        const isRootCollection = _type === 'isNull';
        const isNotAllProcessesView = _type === 'equal' && _value.trim();

        if (isRootCollection || isNotAllProcessesView) {
            return this.processCrudService.getPage(user, specs, paging);
        }
        throw new NotFoundException();
    }

    @ApiOperation({
        summary: 'Get filtered and paginated list of all processes',
    })
    @ApiOkResponse({
        description: 'List of processes successfully returned.',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(ProcessEntity) },
                },
                total: { type: 'number', example: 42 },
                page: { type: 'number', example: 0 },
                size: { type: 'number', example: 20 },
            },
        },
    })
    @ApiProcessPageFilters()
    @Get('GetAllPage')
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ, FeatureKey.ALL_PROCESSES_READ)
    getFilteredPage(
        @Specifiable(ProcessCriteria) specs: Specs<ProcessEntity>,
        @Pageable() paging: Paging,
        @UserDecorator() user: User
    ) {
        specs.where = {
            ...specs.where,
        };
        return this.processCrudService.getPage(user, specs, paging);
    }

    @ApiOperation({
        summary: 'Get a process by its ID',
        description: 'Returns details of a specific process if the authenticated user has access to it.'
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiOkResponse({
        description: 'Process successfully retrieved.',
        type: ProcessEntity
    })
    @ApiForbiddenResponse({
        description: 'User does not have access to the specified process.',
    })
    @Get(':id')
    @FeatureKeys(FeatureKey.PROCESS_READ)
    async get(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.get(user, id);
    }
    @ApiOperation({
        summary: 'Delete a process by its ID'
    })
    @ApiParam(processIdSwaggerObjectDescription)
    @ApiOkResponse({
        description: 'Process successfully deleted. Returns the ID of the deleted process.',
        schema: {
            type: 'number',
            example: 123,
        },
    })
    @ApiNotFoundResponse({
        description: 'Process not found or does not exist in user\'s tenant.',
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to delete this process.',
    })
    @Delete(':id')
    @FeatureKeys(FeatureKey.PROCESS_DELETE)
    async delete(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.delete(user, id);
    }

    async checkAccess(user: User, processId: number) {
        const hasAccess = await this.processService.hasAccess(user, processId);

        if (!hasAccess) {
            throw new ForbiddenException();
        }
    }

    async hasConfigureAccess(user: User, processId: number) {
        const canConfigure = await this.processService.canConfigureProcess(
            user,
            processId
        );

        if (!canConfigure) {
            throw new ForbiddenException();
        }
    }

    async hasTenantAdminAccess(user, processId: number) {
        this.hasConfigureAccess(user, processId);

        return isTenantAdmin(user);
    }
}
