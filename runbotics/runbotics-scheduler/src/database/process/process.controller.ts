import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { ProcessService } from '#/database/process/process.service';
import { CreateProcessDto, createProcessSchema } from '#/database/process/dto/create-process.dto';
import { User } from '#/utils/decorators/user.decorator';
import { UserEntity } from '#/database/user/user.entity';
import { UpdateProcessDto, updateProcessSchema } from '#/database/process/dto/update-process.dto';
import { ProcessCrudService } from '#/database/process/process-crud.service';
import { UpdateDiagramDto, updateDiagramSchema } from '#/database/process/dto/update-diagram.dto';
import { UpdateAttendedDto, updateAttendedSchema } from '#/database/process/dto/update-attended.dto';
import { UpdateTriggerableDto, updateTriggerableSchema } from '#/database/process/dto/update-triggerable.dto';
import {
    UpdateProcessBotCollectionDto,
    updateProcessBotCollectionSchema,
} from '#/database/process/dto/update-process-bot-collection.dto';
import {
    UpdateProcessOutputTypeDto,
    updateProcessOutputTypeSchema,
} from '#/database/process/dto/update-process-output-type.dto';


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
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(createProcessSchema)) processDto: CreateProcessDto,
    ) {
        const canCreate = this.processService.checkCreateProcessViability(user);

        if (!canCreate) {
            throw new ForbiddenException('Guest can create only one process');
        }

        return this.processCrudService.create(user, processDto);
    }

    @Post('guest')
    @FeatureKeys(FeatureKey.PROCESS_ADD)
    createGuestProcess(
        @User() user: UserEntity,
    ) {
        const canCreate = this.processService.checkCreateProcessViability(user);

        if (!canCreate) {
            throw new ForbiddenException('Guest can create only one process');
        }

        return this.processCrudService.createGuestProcess();
    }

    @Put(':id')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_INFO)
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(updateProcessSchema)) processDto: UpdateProcessDto,
    ) {
        return this.processCrudService.update(user.tenantId, id, processDto);
    }
    
    @Patch(':id/diagram')
    @FeatureKeys(FeatureKey.PROCESS_EDIT_STRUCTURE)
    setDiagram(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(updateDiagramSchema)) updateDiagramDto: UpdateDiagramDto,
    ) {
        return this.processCrudService.updateDiagram(user, id, updateDiagramDto);
    }

    @Patch(':id/is-attended')
    @FeatureKeys(FeatureKey.PROCESS_IS_ATTENDED_EDIT)
    setIsAttended(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(updateAttendedSchema)) attendedDto: UpdateAttendedDto,
    ) {
        return this.processCrudService.update(user.tenantId, id, { isAttended: attendedDto.isAttended });
    }

    @Patch(':id/is-triggerable')
    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EDIT)
    setIsTriggerable(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(updateTriggerableSchema)) triggerableDto: UpdateTriggerableDto,
    ) {
        return this.processCrudService.update(user.tenantId, id, { isAttended: triggerableDto.isTriggerable });
    }

    @Patch(':id/bot-collection')
    @FeatureKeys(FeatureKey.PROCESS_BOT_COLLECTION_EDIT)
    setBotCollection(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(updateProcessBotCollectionSchema)) updateBotCollectionDto: UpdateProcessBotCollectionDto,
    ) {
        return this.processCrudService.update(user.tenantId, id, { botCollection: updateBotCollectionDto.botCollection });
    }

    @Patch(':id/output-type')
    @FeatureKeys(FeatureKey.PROCESS_BOT_COLLECTION_EDIT)
    setOutputType(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
        @Body(new ZodValidationPipe(updateProcessOutputTypeSchema)) updateOutputTypeDto: UpdateProcessOutputTypeDto,
    ) {
        return this.processCrudService.update(user.tenantId, id, { outputType: updateOutputTypeDto.outputType });
    }

    // @TODO paging/criteria
    @Get()
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    async getAll(
        @User() user: UserEntity,
    ){
        return (await this.processCrudService.getAll(user)).map(x => ({...x, name: 'xD2'}));
    }
    
    // @TODO paging/criteria
    @Get('page')
    @FeatureKeys(FeatureKey.PROCESS_LIST_READ)
    getPage(
        @User() user: UserEntity,
    ){
        return this.processCrudService.getAll(user);
    }

    @Get(':id')
    get(
        @Param('id', new ParseIntPipe()) id: number,
        @User() user: UserEntity,
    ){
        return this.processCrudService.get(user, id);
    }
    
    checkPermission(user: UserEntity, processId: number){
        
    }
}
