import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Logger } from '#/utils/logger';

@Controller('api/scheduler/health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkHealth() {
    this.logger.log('Health check status: OK');
    return this.healthService.getHealthStatus();
  }
}
