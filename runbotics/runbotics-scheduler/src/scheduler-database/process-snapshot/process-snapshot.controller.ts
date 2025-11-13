import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { ProcessSnapshotService } from './process-snapshot.service';
import { CreateSnapshotDto, CreateSnapshotSwaggerDto, createSnapshotSchema } from './dto/create-snapshot.dto';
import { ProcessSnapshotResponseDto, ProcessSnapshotDetailResponseDto } from './dto/process-snapshot-response.dto';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Page } from '#/utils/page/page';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';

@ApiTags('Process Snapshots')
@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/process-snapshots')
export class ProcessSnapshotController {
    private readonly logger = new Logger(ProcessSnapshotController.name);
    
    constructor(private readonly processSnapshotService: ProcessSnapshotService) {}
    
    @ApiOperation({ 
        summary: 'Create a snapshot of the process',
        description: 'Creates a new snapshot of the current process definition with compression'
    })
    @ApiParam({ 
        name: 'id', 
        type: 'number', 
        description: 'Process ID',
        example: 1
    })
    @ApiBody({ type: CreateSnapshotSwaggerDto })
    @ApiCreatedResponse({
        description: 'Snapshot created successfully',
        type: ProcessSnapshotResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Process not found' })
    @ApiBadRequestResponse({ description: 'Invalid input or empty process definition' })
    @Post('processes/:id/snapshots')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_INFO)
    async createSnapshot(
        @Param('tenantId') tenantId: string,
        @Param('id', ParseIntPipe) processId: number,
        @Body(new ZodValidationPipe(createSnapshotSchema)) createSnapshotDto: CreateSnapshotDto,
        @UserDecorator() user: User,
    ): Promise<ProcessSnapshotResponseDto> {
        this.logger.log(`Creating snapshot for process ${processId}, tenant ${tenantId}`);
        this.logger.log('jestem tutaj');
        return this.processSnapshotService.createSnapshot(processId, user.id, createSnapshotDto);
    }
    
    @ApiOperation({ 
        summary: 'Get snapshot history for a process',
        description: 'Retrieves paginated list of snapshots for the specified process'
    })
    @ApiParam({ 
        name: 'id', 
        type: 'number', 
        description: 'Process ID',
        example: 1
    })
    @ApiQuery({ name: 'page', type: 'number', required: false, description: 'Page number (0-based)', example: 0 })
    @ApiQuery({ name: 'size', type: 'number', required: false, description: 'Page size', example: 20 })
    @ApiQuery({ name: 'sort', type: 'string', required: false, description: 'Sort criteria', example: 'versionNumber,desc' })
    @ApiOkResponse({
        description: 'Snapshot history retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ProcessSnapshotResponseDto' }
                },
                totalElements: { type: 'number' },
                totalPages: { type: 'number' },
                size: { type: 'number' },
                number: { type: 'number' }
            }
        }
    })
    @Get('processes/:id/snapshots')
    @FeatureKeys(FeatureKey.PROCESS_READ)
    @ApiNotFoundResponse({ description: 'Process not found' })
    async getSnapshotHistory(
        @Param('id', ParseIntPipe) processId: number,
        @Pageable() paging: Paging,
    ): Promise<Page<ProcessSnapshotResponseDto>> {
        return this.processSnapshotService.getSnapshotHistory(processId, paging);
    }
    
    @ApiOperation({ 
        summary: 'Get snapshot details',
        description: 'Retrieves detailed information about a specific snapshot including decompressed process definition'
    })
    @ApiParam({ 
        name: 'snapshotId', 
        type: 'number', 
        description: 'Snapshot ID',
        example: 1
    })
    @ApiOkResponse({
        description: 'Snapshot details retrieved successfully',
        type: ProcessSnapshotDetailResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Snapshot not found' })
    @Get(':snapshotId')
    @FeatureKeys(FeatureKey.PROCESS_READ)
    async getSnapshotDetails(
        @Param('snapshotId', ParseIntPipe) snapshotId: number,
    ): Promise<ProcessSnapshotDetailResponseDto> {
        return this.processSnapshotService.getSnapshotDetails(snapshotId);
    }
    
    @ApiOperation({ 
        summary: 'Restore process from snapshot',
        description: 'Restores the process definition from the specified snapshot. Optionally creates a backup before restoration.'
    })
    @ApiParam({ 
        name: 'snapshotId', 
        type: 'number', 
        description: 'Snapshot ID to restore',
        example: 1
    })
    @ApiOkResponse({
        description: 'Process restored successfully. Returns backup snapshot if created.',
        type: ProcessSnapshotResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Snapshot not found' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @Post(':snapshotId/restore')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_STRUCTURE)
    async restoreSnapshot(
        @Param('snapshotId', ParseIntPipe) snapshotId: number,
        @UserDecorator() user: User,
    ): Promise<ProcessSnapshotResponseDto> {
        return this.processSnapshotService.restoreSnapshot(snapshotId, user.id);
    }
}
