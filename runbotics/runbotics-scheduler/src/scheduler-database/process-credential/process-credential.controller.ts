import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, UseInterceptors } from '@nestjs/common';
import { ProcessCredentialService } from './process-credential.service';
import { IProcess } from 'runbotics-common';
import { User } from '#/utils/decorators/user.decorator';
import { UserEntity } from '#/database/user/user.entity';


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

    @Delete(':id')
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
        @User() user: UserEntity,
    ) {
        this.logger.log('REST request to remove process-credential by id: ', id);
        await this.processCredentialService.delete(id, user);
    }
}
