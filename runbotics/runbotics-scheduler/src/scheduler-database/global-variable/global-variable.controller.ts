import { Controller } from '@nestjs/common';

import { Logger } from '#/utils/logger';

import { GlobalVariableService } from './global-variable.service';


@Controller('/api/scheduler/tenants/:tenantId/global-variables')
export class GlobalVariableController {
    private readonly logger = new Logger(GlobalVariableController.name);

    constructor(
        private readonly globalVariableService: GlobalVariableService,
    ) {}
}