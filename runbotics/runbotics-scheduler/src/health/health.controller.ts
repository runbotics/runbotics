import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Logger } from '#/utils/logger';
import { Public } from '#/auth/guards';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from '#/utils/swagger.utils';

@ApiTags(SwaggerTags.HEALTH)
@Controller('api/scheduler/health')
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    constructor(private readonly healthService: HealthService) {}

    @ApiOperation({
        summary: 'Get healthcheck status',
        description: 'Returns healthcheck status'
    })
    @ApiOkResponse({
        description: 'Health check status OK'
    })
    @Public()
    @Get()
    checkHealth() {
        this.logger.log('Health check status: OK');
        return this.healthService.getHealthStatus();
    }
}
