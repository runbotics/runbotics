import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, UseInterceptors } from '@nestjs/common';
import { ProcessCredentialService } from './process-credential.service';
import { IProcess } from 'runbotics-common';
import { User } from '#/utils/decorators/user.decorator';
import { User as UserEntity } from '#/scheduler-database/user/user.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { CreateProcessCredentialDto, createProcessCredentialSchema } from './dto/create-process-credential.dto';


@UseInterceptors(TenantInterceptor)
@Controller('api/scheduler/tenants/:tenantId/process-credentials')
export class ProcessCredentialController {
    private readonly logger = new Logger(ProcessCredentialController.name);
    constructor(private readonly processCredentialService: ProcessCredentialService) {}

    @Get('processes/:processId')
    getAllByProcessId(
        @Param('processId', ParseIntPipe) processId: IProcess['id'],
        @User() user: UserEntity,
    ) {
        this.logger.log('REST request to get all process-credentials by process id: ', processId);
        return this.processCredentialService.findAllByProcessId(processId, user);
    }

    @Post()
    async create(
        @Body(new ZodValidationPipe(createProcessCredentialSchema))
        processCredentialDto: CreateProcessCredentialDto,
        @User() user: UserEntity,
    ) {
        this.logger.log('REST request to create new process-credential relation');
        await this.processCredentialService.create(processCredentialDto, user);
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
        @User() user: UserEntity,
    ) {
        this.logger.log('REST request to remove process-credential by id: ', id);
        await this.processCredentialService.delete(id, user);
    }
}
