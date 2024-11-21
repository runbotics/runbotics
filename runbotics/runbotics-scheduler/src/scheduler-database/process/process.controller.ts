import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    Body,
    Controller, Delete,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { CreateProcessDto, createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { UpdateProcessDto, updateProcessSchema } from '#/scheduler-database/process/dto/update-process.dto';
import { ProcessCrudService } from '#/scheduler-database/process/process-crud.service';
import { UpdateDiagramDto, updateDiagramSchema } from '#/scheduler-database/process/dto/update-diagram.dto';
import { UpdateAttendedDto, updateAttendedSchema } from '#/scheduler-database/process/dto/update-attended.dto';
import { UpdateTriggerableDto, updateTriggerableSchema } from '#/scheduler-database/process/dto/update-triggerable.dto';
import {
    UpdateProcessBotCollectionDto,
    updateProcessBotCollectionSchema,
} from '#/scheduler-database/process/dto/update-process-bot-collection.dto';
import {
    UpdateProcessOutputTypeDto,
    updateProcessOutputTypeSchema,
} from '#/scheduler-database/process/dto/update-process-output-type.dto';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { ProcessCriteria } from '#/scheduler-database/process/criteria/process.criteria';
import {
    updateProcessBotSystemSchema,
    UpdateProcessBotSystemDto,
} from '#/scheduler-database/process/dto/update-process-bot-system.dto';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { UpdateExecutionInfoDto, updateExecutionInfoSchema } from './dto/update-execution-info.dto';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/processes')
export class ProcessController {
    private readonly logger = new Logger(ProcessController.name);

    constructor(
        private readonly processService: ProcessService,
        private readonly processCrudService: ProcessCrudService,
    ) {
    }

    @Post()
    @FeatureKeys(FeatureKey.PROCESS_ADD)
    createProcess(
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(createProcessSchema)) processDto: CreateProcessDto,
    ) {
        const canCreate = this.processCrudService.checkCreateProcessViability(user);

        if (!canCreate) {
            throw new ForbiddenException('Guest can create only one process');
        }

        return this.processCrudService.create(user, processDto);
    }

    @Post('guest')
    @FeatureKeys(FeatureKey.PROCESS_ADD)
    createGuestProcess(
        @UserDecorator() user: User,
    ) {
        const canCreate = this.processCrudService.checkCreateProcessViability(user);

        if (!canCreate) {
            throw new ForbiddenException('Guest can create only one process');
        }

        return this.processCrudService.createGuestProcess(user);
    }

    @Patch(':id')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_INFO)
    async update(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessSchema)) processDto: UpdateProcessDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.update(user, id, processDto);
    }

    @Patch(':id/diagram')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_STRUCTURE)
    async setDiagram(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateDiagramSchema)) updateDiagramDto: UpdateDiagramDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.updateDiagram(user, id, updateDiagramDto);
    }

    @Patch(':id/execution-info')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_INFO)
    async setExecutionInfo(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateExecutionInfoSchema)) updateExecutionInfoDto: UpdateExecutionInfoDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, { executionInfo: updateExecutionInfoDto.executionInfo });
    }

    @Patch(':id/is-attended')
    @FeatureKeys(FeatureKey.PROCESS_IS_ATTENDED_EDIT)
    async setIsAttended(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateAttendedSchema)) attendedDto: UpdateAttendedDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, { isAttended: attendedDto.isAttended });
    }

    @Patch(':id/is-triggerable')
    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EDIT)
    async setIsTriggerable(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateTriggerableSchema)) triggerableDto: UpdateTriggerableDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, { isTriggerable: triggerableDto.isTriggerable });
    }

    @Patch(':id/bot-collection')
    @FeatureKeys(FeatureKey.PROCESS_BOT_COLLECTION_EDIT)
    async setBotCollection(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessBotCollectionSchema)) updateBotCollectionDto: UpdateProcessBotCollectionDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, { botCollection: updateBotCollectionDto.botCollection });
    }

    @Patch(':id/bot-system')
    @FeatureKeys(FeatureKey.PROCESS_BOT_SYSTEM_EDIT)
    async setBotSystem(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessBotSystemSchema)) updateProcessBotSystemDto: UpdateProcessBotSystemDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, updateProcessBotSystemDto);
    }

    @Patch(':id/output-type')
    @FeatureKeys(FeatureKey.PROCESS_BOT_COLLECTION_EDIT)
    async setOutputType(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(updateProcessOutputTypeSchema)) updateOutputTypeDto: UpdateProcessOutputTypeDto,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.partialUpdate(user, id, { output: updateOutputTypeDto.output });
    }

    @Get()
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    async getAll(
        @Specifiable(ProcessCriteria) specs: Specs<ProcessEntity>,
        @UserDecorator() user: User,
    ) {
        return (await this.processCrudService.getAll(user, specs));
    }

    @Get('GetPage')
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    getPage(
        @Specifiable(ProcessCriteria) specs: Specs<ProcessEntity>,
        @Pageable() paging: Paging,
        @UserDecorator() user: User,
    ) {
        return this.processCrudService.getPage(user, specs, paging);
    }

    @Get(':id')
    @FeatureKeys(FeatureKey.PROCESS_READ)
    async get(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
    ) {
        await this.checkAccess(user, id);

        return this.processCrudService.get(user, id);
    }

    @Delete(':id')
    @FeatureKeys(FeatureKey.PROCESS_DELETE)
    async delete(
        @Param('id', new ParseIntPipe()) id: number,
        @UserDecorator() user: User,
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
}
