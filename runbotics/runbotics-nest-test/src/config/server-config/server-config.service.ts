import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { DatabaseSettings } from './server-config.types';

@Injectable()
export class ServerConfigService {
  constructor(private configService: ConfigService) {}

  get dbSettings(): DatabaseSettings {
    return {
      host: this.configService.get('RUNBOTICS_DB_HOST'),
      port: this.convertNumber(this.configService.get('RUNBOTICS_DB_PORT')),
      username: this.configService.get('RUNBOTICS_DB_USER'),
      password: this.configService.get('RUNBOTICS_DB_PASSWORD'),
      database: this.configService.get('RUNBOTICS_DB_DATABASE'),
    };
  }
  private convertNumber(variable: string | undefined): number | undefined {
    const numericVariable = Number(variable);
    return Number.isNaN(numericVariable) ? undefined : numericVariable;
  }
}
