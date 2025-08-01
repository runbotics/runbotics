import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus(): { status: string } {
    return { status: 'ok' };
  }
}