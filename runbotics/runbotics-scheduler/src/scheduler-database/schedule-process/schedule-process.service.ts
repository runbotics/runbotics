import { Logger } from '#/utils/logger';
import { Injectable } from '@nestjs/common';


@Injectable()
export class ScheduleProcessService {
    private readonly logger = new Logger(ScheduleProcessService.name);
}