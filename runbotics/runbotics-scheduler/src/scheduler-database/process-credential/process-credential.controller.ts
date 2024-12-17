import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ProcessCredentialService } from './process-credential.service';
import { FeatureKey, IProcess } from 'runbotics-common';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { CreateProcessCredentialDto, createProcessCredentialSchema } from './dto/create-process-credential.dto';
import { EditProcessCredentialsDto, editProcessCredentialsDto } from './dto/update-process-credentials.dto';
import { FeatureKeys } from '#/auth/featureKey.decorator';


@UseInterceptors(TenantInterceptor)
@FeatureKeys(FeatureKey.CREDENTIALS_PAGE_READ)
@Controller('api/scheduler/tenants/:tenantId/process-credentials')
export class ProcessCredentialController {
    private readonly logger = new Logger(ProcessCredentialController.name);
    constructor(private readonly processCredentialService: ProcessCredentialService) {}

    @Get('processes/:processId')
    getAllByProcessId(
        @Param('processId', ParseIntPipe) processId: IProcess['id'],
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to get all process-credentials by process id: ', processId);
        return this.processCredentialService.findAllByProcessId(processId, user);
    }

    @Post()
    async create(
        @Body(new ZodValidationPipe(createProcessCredentialSchema))
            processCredentialDto: CreateProcessCredentialDto,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to create new process-credential relation');
        await this.processCredentialService.create(processCredentialDto, user);
    }

    @Patch('processes/:processId')
    update(
        @Param('processId', ParseIntPipe) processId: IProcess['id'],
        @Body(new ZodValidationPipe(editProcessCredentialsDto))
            processCredentialsDto: EditProcessCredentialsDto,
        @UserDecorator() user: User,
    ) {
        return this.processCredentialService.update(processId, user, processCredentialsDto);
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to remove process-credential by id: ', id);
        await this.processCredentialService.delete(id, user);
    }
}
